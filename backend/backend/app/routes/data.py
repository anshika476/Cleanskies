from fastapi import APIRouter, Depends, HTTPException, status
from app import models, schemas, core
from pathlib import Path
from functools import lru_cache
import json

router = APIRouter(prefix="/api/data", tags=["Data"])

# data.py is in backend/app/routes/
# We want backend/historical_data.json  -> two levels up from routes/ then join
DATA_PATH = Path(__file__).resolve().parents[2] / "historical_data.json"

@lru_cache(maxsize=1)
def load_historical_data():
    try:
        with DATA_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

@router.get("/trends/{zipcode}", response_model=schemas.TrendsResponse)
def get_trends_by_zipcode(
    zipcode: str,
    current_user: models.User = Depends(core.get_current_user),
):
    data = load_historical_data()
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Historical data file not found on server at {DATA_PATH}."
        )

    zipcode_data = data.get(zipcode)
    if not zipcode_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No historical data found for zip code {zipcode}."
        )

    return zipcode_data
