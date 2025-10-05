from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas, core, db

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

@router.get("/me", response_model=schemas.User)
def get_current_user_profile(
    current_user: models.User = Depends(core.get_current_user)
):
    """
    Fetches the profile of the currently authenticated user.
    """
    return current_user


@router.put("/me", response_model=schemas.User)
def update_current_user_profile(
    user_updates: schemas.UserUpdate,
    db_session: Session = Depends(db.get_db),
    current_user: models.User = Depends(core.get_current_user)
):
    """
    Updates the profile of the currently authenticated user.
    """
    # Get the update data, excluding any unset fields
    update_data = user_updates.model_dump(exclude_unset=True)

    # Update the user object with the new data
    for key, value in update_data.items():
        setattr(current_user, key, value)

    # Commit the changes to the database
    db_session.add(current_user)
    db_session.commit()
    db_session.refresh(current_user)

    return current_user
