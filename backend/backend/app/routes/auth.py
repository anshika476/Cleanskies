from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas, core, db

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# --- Registration Endpoint ---
@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register_user(user_create: schemas.UserCreate, database: Session = Depends(db.get_db)):
    """
    Handles user registration.
    1. Checks if a user with the same username or email already exists.
    2. Hashes the provided password.
    3. Creates a new user record in the database.
    """
    # Check for existing user
    db_user = database.query(models.User).filter(
        (models.User.email == user_create.email) | (models.User.username == user_create.username)
    ).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )

    # Hash the password
    hashed_password = core.get_password_hash(user_create.password)
    
    # Create new user instance
    new_user = models.User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=hashed_password
    )

    # Add to database
    database.add(new_user)
    database.commit()
    database.refresh(new_user)

    return new_user


# --- Login Endpoint ---
@router.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), database: Session = Depends(db.get_db)):
    """
    Handles user login.
    1. Finds the user by username.
    2. Verifies the provided password against the stored hash.
    3. Creates and returns a JWT access token if credentials are valid.
    """
    user = database.query(models.User).filter(models.User.username == form_data.username).first()

    # Check if user exists and password is correct
    if not user or not core.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = core.create_access_token(
        data={"sub": user.username}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

