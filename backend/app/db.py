from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# --- Load environment variables ---
load_dotenv()  # ensures .env file values are loaded

# --- Get DATABASE_URL from .env ---
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not found. Make sure it's defined in your .env file.")

# --- Create database engine ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Dependency for getting DB session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

