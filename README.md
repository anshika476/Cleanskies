# 🌎 TEMPO Air Quality Forecasting Web App

A web-based platform that forecasts **real-time air quality** across North America by integrating **NASA’s TEMPO satellite data**, **ground-based air quality measurements**, and **weather data**.  
The app aims to **notify users of poor air quality** and support **public health decisions** through accessible, accurate, and timely forecasts.

---
## 📄 Project Presentation

You can download the full project presentation here:

[📥 Download Presentation (PDF)](./assests/From%20earthdata%20to%20action_%20(4).pdf)

## 🎥 Demo Video

[📥 Download Demo Video](./assests/cleanskies.mp4)

## 🚀 Project Overview

NASA’s **T**ropospheric **E**missions: **M**onitoring of **PO**llution (**TEMPO**) mission provides **hourly, high-resolution satellite measurements** of pollutants like **Ozone (O₃)**, **Nitrogen Dioxide (NO₂)**, **Sulfur Dioxide (SO₂)**, and **Aerosols** over North America.

This project leverages **TEMPO data** alongside:
- 🌍 **Ground-based air quality sensors** (e.g., EPA AirNow, PurpleAir)
- ☁️ **Weather data** (wind, humidity, temperature)

The app delivers:
- ✅ Real-time AQI visualization on an interactive map
- 🔮 Forecasts for pollutant levels (e.g., PM2.5, O₃) for the next 6–24 hours
- 🔔 Alerts and notifications when AQI exceeds health thresholds
- 💡 Actionable insights for communities and public health officials

---

## ✨ Key Features

- 📡 **Data Integration:** Combines TEMPO, ground sensors, and weather data in near real-time
- 📈 **Forecasting Engine:** Predicts AQI using machine learning models (e.g., XGBoost, Random Forest)
- 🗺️ **Interactive Map:** Displays AQI heatmaps by region with color-coded health levels
- 📊 **Trends Dashboard:** Visualizes historical and predicted AQI for any location
- 🔔 **Alert System:** Sends notifications for poor air quality (via push, email, or SMS)
- ☁️ **Scalable Cloud Deployment:** Seamlessly scales from local development to cloud environments (AWS/GCP/Azure)
- 👩‍💻 **Collaboration-Friendly:** Uses containerized workflows (Docker/Kubernetes) for smooth teamwork

---

## 🛠️ Tech Stack

| Layer                     | Technology                                      |
|---------------------------|------------------------------------------------|
| **Frontend**              | React.js, Leaflet.js / Mapbox, Chart.js / Plotly |
| **Backend API**           | Python (FastAPI), RESTful endpoints            |
| **Data Processing**       | Python (Pandas, NumPy, SciKit-Learn, XGBoost)  |
| **Database**              | PostgreSQL / MongoDB / Firebase                |
| **Notifications**         | Firebase Cloud Messaging (FCM), Twilio (SMS)  |
| **Cloud Deployment**      |  Vercel / Render                               |
| **Visualization**         | OpenWeather , AirNow                           |
| **Version Control**       | GitHub,                                        |

---

## 📡 Data Sources

- 🛰️ **TEMPO (NASA)**: [Hourly satellite-based air pollution measurements  ](https://www.earthdata.nasa.gov/data/instruments/tempo)
- ☀️ **Weather Data**: [Air-Now](https://www.airnow.gov/) , [OpenAQ](https://openaq.org/) 
- **MERRA2 data**: (https://search.earthdata.nasa.gov/search?q=M2IMNPASM)
- **Nasa Pandors Data**: (https://pandora.gsfc.nasa.gov/)


