from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any, Literal

# --- User Schemas ---

# Base schema for notification preferences
class NotificationPreferences(BaseModel):
    email: bool = True
    push: bool = True
    sms: bool = False

# Base schema for air quality thresholds
class AirQualityThresholds(BaseModel):
    pm25: int = 100
    pm10: int = 100
    o3: int = 100
    no2: int = 100

# Schema for creating a new user (registration)
# This defines the data your frontend must send
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

# --- THIS IS THE RENAMED CLASS ---
# Schema for the user's public profile data
# This defines the data we send back to the frontend
class User(BaseModel): # <-- Formerly UserPublic
    id: int
    username: str
    email: EmailStr
    age: Optional[int] = None
    location: Optional[str] = None
    accountType: Optional[Literal["individual", "institution"]] = None
    healthConditions: Optional[str] = None
    isSmoker: Optional[bool] = None
    hasAllergies: Optional[bool] = None
    respiratoryIssues: Optional[bool] = None
    heartConditions: Optional[bool] = None
    notificationPreferences: Optional[dict] = None
    airQualityThresholds: Optional[dict] = None
    profilePicture: Optional[str] = None

    class Config:
        from_attributes = True


# --- Data Schemas ---

class TrendsResponse(BaseModel):
    locationName: str
    weeklyTrends: list
    monthlyTrends: list

# --- User Update Schema ---
class UserUpdate(BaseModel):
    """
    Schema for updating user profile. All fields are optional.
    """
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    location: Optional[str] = None
    accountType: Optional[Literal["individual", "institution"]] = None
    healthConditions: Optional[str] = None
    isSmoker: Optional[bool] = None
    hasAllergies: Optional[bool] = None
    respiratoryIssues: Optional[bool] = None
    heartConditions: Optional[bool] = None
    notificationPreferences: Optional[dict] = None
    airQualityThresholds: Optional[dict] = None
    profilePicture: Optional[str] = None

    class Config:
        from_attributes = True

# -----------------------------
# --- Chatbot Schemas (NEW) ---
# -----------------------------

class ChatQuery(BaseModel):
    """Defines the structure for a user's chatbot request."""
    question: str = Field(..., description="The user's question about air quality.")
    zip_code: Optional[str] = Field(None, description="Optional ZIP code override.")
    health_issue: Optional[str] = Field(None, description="Optional health condition (e.g., 'asthma').")
    activity: Optional[str] = Field(None, description="Optional planned activity (e.g., 'jogging').")

class ChatResponse(BaseModel):
    """Defines the structure for the chatbot's response."""
    answer: str = Field(..., description="The AI's generated response.")
    active_zip: str = Field(..., description="The ZIP code the answer was based on.")


# --- Token Schemas ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

