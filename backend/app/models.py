from sqlalchemy import (
    Boolean, Column, Integer, String, JSON
)
from app.db import Base

class User(Base):
    __tablename__ = "users"

    # Core user info
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Optional profile information from your frontend
    age = Column(Integer, nullable=True)
    location = Column(String, nullable=True)
    accountType = Column(String, nullable=True) # "individual" or "institution"
    healthConditions = Column(String, nullable=True)
    isSmoker = Column(Boolean, default=False)
    hasAllergies = Column(Boolean, default=False)
    respiratoryIssues = Column(Boolean, default=False)
    heartConditions = Column(Boolean, default=False)
    profilePicture = Column(String, nullable=True)

    # Storing JSON for nested objects
    notificationPreferences = Column(JSON, nullable=True)
    airQualityThresholds = Column(JSON, nullable=True)

