from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.db import engine, Base
from app.routes import auth, data, users
from app.routes import chatbot  # <--- ADD THIS LINE to import the new router

# Load environment variables
load_dotenv()

# Debug check (optional)
print("✅ Database URL loaded:", os.getenv("DATABASE_URL"))

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="CleanSkies API",
    description="Backend for the CleanSkies air quality application.",
    version="1.0.0"
)

# CORS setup
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(data.router)
app.include_router(users.router)
app.include_router(chatbot.router) # <--- ADD THIS LINE to include the new router

@app.get("/")
def home():
    return {"message": "CleanSkies API is running 🚀"}

