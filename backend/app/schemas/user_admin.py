from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- Base dùng chung ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = "customer"

# --- Dùng cho CREATE (Cần pass) ---
class UserCreate(UserBase):
    password: str

# --- Dùng cho UPDATE ---
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

# --- Dùng cho RESPONSE ---
class UserResponse(UserBase):
    user_id: str
    created_at: datetime
    class Config:
        from_attributes = True