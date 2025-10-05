import os
import requests
import csv
import time
import threading
from datetime import datetime, timezone
# --- Cell 2: Configuration & Logging ---

# Set your API keys
AIRNOW_API_KEY = os.environ.get("AIRNOW_API_KEY")
GROQ_API_KEY   = os.environ.get("GROQ_API_KEY")

# File paths
USERS_CSV = "users.csv"
DAILY_AQI_CSV = "daily_aqi.csv"
LIVE_AQI_FILE = "live_aqi.csv"   # ✅ add this line
LOG_FILE = "aqi_chatbot.log"

# AirNow endpoints
AIRNOW_BASE = "https://www.airnowapi.org/aq/forecast"
OBS_BASE    = "https://www.airnowapi.org/aq/observation"

# Groq API endpoint
GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

# Simple logger
def log(msg: str):
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{stamp}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def log(msg):
    ts = datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
    print(f"{ts} {msg}")

def fetch_live_aqi_by_zip(zip_code):
    """Fetch live AQI data from AirNow API for a given ZIP code."""
    url = "https://www.airnowapi.org/aq/observation/zipCode/current/"
    params = {
        "format": "application/json",
        "zipCode": zip_code,
        "API_KEY": AIRNOW_API_KEY
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        rows = []
        for item in data:
            rows.append({
                "DateObserved": item.get("DateObserved"),
                "ReportingArea": item.get("ReportingArea"),
                "StateCode": item.get("StateCode"),
                "ParameterName": item.get("ParameterName"),
                "AQI": item.get("AQI"),
                "Category": item["Category"]["Name"]
            })
        return rows
    except Exception as e:
        log(f"Error fetching live AQI for {zip_code}: {e}")
        return []
    
def overwrite_live_aqi_csv(rows):
    """Save rows to live_aqi.csv."""
    if not rows:
        log("⚠️ No data to write to CSV.")
        return
    with open(LIVE_AQI_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    log(f"✅ Updated {LIVE_AQI_FILE} with {len(rows)} rows.")


def daily_airnow_job(zip_list):
    """Fetch live AQI for all ZIPs and update CSV."""
    log("Running daily AirNow live data job ...")
    all_rows = []
    for z in zip_list:
        rows = fetch_live_aqi_by_zip(z)
        all_rows.extend(rows)
        time.sleep(0.3)
    overwrite_live_aqi_csv(all_rows)
    log("Live AQI fetch complete.")


def schedule_daily_job(zip_list, interval_hours=1):
    """Run the live AQI update every given hours."""
    def loop():
        while True:
            daily_airnow_job(zip_list)
            time.sleep(interval_hours * 3600)
    threading.Thread(target=loop, daemon=True).start()
    log(f"Scheduler started (updates every {interval_hours} hours).")

def build_context(aqi_rows, zip_code, health_issue=None, activity=None):
    if not aqi_rows:
        return f"No air quality data available for ZIP {zip_code}."

    lines = []
    for r in aqi_rows:
        lines.append(f"{r['ParameterName']}={r['AQI']} ({r['Category']})")

    context = f"Current AQI for ZIP {zip_code}: " + "; ".join(lines)
    if health_issue:
        context += f"\nUser health condition: {health_issue}"
    if activity:
        context += f"\nUser activity: {activity}"
    return context

# --- Cell 7: Groq AI Call ---

import requests

def call_groq(system_prompt, user_question, context_text, model="llama-3.1-8b-instant"):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context_text}"},
            {"role": "user", "content": user_question}
        ],
        "temperature": 0.3,
        "max_tokens": 800
    }

    # ✅ Corrected variable name
    response = requests.post(GROQ_CHAT_URL, headers=headers, json=payload, timeout=30)

    if not response.ok:
        print("❌ Groq Error:", response.status_code, response.text)
        response.raise_for_status()

    data = response.json()
    return data["choices"][0]["message"]["content"]

DEFAULT_SYSTEM_PROMPT = """You are a helpful air quality assistant.
You answer air quality questions clearly, concisely, and naturally.
Use the latest AQI data from the context.
If the user asks about a different location, use that location instead of their default ZIP.
Do not mention data sources or APIs in your answer.
"""

def handle_user_question(user_id, question, zip_code=None, health_issue=None, activity=None, user_profile=None):
    """
    Main chatbot handler.
    - zip_code: user-specified ZIP or location from question
    - user_profile: dict that may include 'zip_code' for default location
    """

    # 1️⃣ Determine which ZIP to use
    active_zip = None

    # Priority: direct argument > user_profile ZIP > default
    if zip_code:
        active_zip = zip_code
    elif user_profile and "zip_code" in user_profile:
        active_zip = user_profile["zip_code"]
    else:
        active_zip = "94103"  # fallback if nothing else given

    # 2️⃣ Fetch live AQI for that ZIP
    aqi_data = fetch_live_aqi_by_zip(active_zip)
    overwrite_live_aqi_csv(aqi_data)

    # 3️⃣ Build context and call Groq
    context = build_context(aqi_data, active_zip, health_issue, activity)
    try:
        answer = call_groq(DEFAULT_SYSTEM_PROMPT, question, context)
    except Exception as e:
        answer = f"Sorry, I couldn’t generate an answer: {e}"

    return answer  #cell 8 old

# --- Cell 9: Scheduler for Live AQI Updates ---

import threading, time

# Define a list of default ZIP codes to refresh periodically.
# These are just fallback locations — the chatbot will still fetch user-specific ZIP data on demand.
DEFAULT_ZIPS = ["94103", "10001", "90001", "60601"]  # SF, NYC, LA, Chicago (example cities)

def daily_airnow_job(zip_list):
    """Fetch latest live AQI data for each ZIP in the list."""
    try:
        log("Running daily AirNow fetch job ...")
        all_rows = []
        for z in zip_list:
            try:
                data = fetch_live_aqi_by_zip(z)
                all_rows.extend(data)
                time.sleep(0.3)
            except Exception as e:
                log(f"ZIP {z} failed: {e}")
        overwrite_live_aqi_csv(all_rows)
        log("Daily AirNow fetch complete.")
    except Exception as e:
        log(f"Daily job failed: {e}")

def schedule_daily_job(zip_list=DEFAULT_ZIPS, interval_hours=24):
    """Start a background thread that updates AQI data periodically."""
    def loop():
        while True:
            daily_airnow_job(zip_list)
            time.sleep(interval_hours * 3600)
    threading.Thread(target=loop, daemon=True).start()
    log(f"Scheduler started (runs every {interval_hours} hours).")

# Start automatic live AQI updates every 3 hours
schedule_daily_job(DEFAULT_ZIPS, interval_hours=3)

