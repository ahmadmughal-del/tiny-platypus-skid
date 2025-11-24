from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from auth import verify_google_token, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from models.user import User
from db import users_collection

router = APIRouter()

class TokenData(BaseModel):
    token: str

@router.post("/google/login")
async def google_login(token_data: TokenData):
    user_info = verify_google_token(token_data.token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    google_id = user_info["sub"]
    email = user_info["email"]
    name = user_info.get("name", "")

    user = await users_collection.find_one({"google_id": google_id})

    if not user:
        new_user = User(google_id=google_id, email=email, name=name)
        await users_collection.insert_one(new_user.dict())
    
    from datetime import timedelta
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": google_id}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user_data: UserCreate):
    # Check if user already exists
    if await users_collection.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed_password = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_password)
    await users_collection.insert_one(new_user.dict())
    return {"message": "User created successfully"}

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user_data: UserCreate):
    # Check if user already exists
    if await users_collection.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    hashed_password = get_password_hash(user_data.password)
    new_user = User(email=user_data.email, hashed_password=hashed_password)
    await users_collection.insert_one(new_user.dict())
    return {"message": "User created successfully"}

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}