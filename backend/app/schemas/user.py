from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class RegisterUserSchema(BaseModel):
    username: str
    phone: Optional[str]
    address: Optional[str]
    email: EmailStr
    password: str = Field(..., min_length=6)

    model_config = ConfigDict(from_attributes=True)


class RegisterResponseSchema(BaseModel):
    id: str
    fullname: str
    phone: Optional[str]
    address: Optional[str]
    email: EmailStr
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)



class LoginSchema(BaseModel):
    phone:Optional[str]
    password:str = Field(...,min_length=6)

class TokenSchema(BaseModel):      # Mục đích: Trả về sau login thành công. Token dùng để xác thực các request sau (như xem profile).
    """" Schema response khi đăng nhập thành công  """
    access_token:str   # Chuỗi token dài (từ hàm create_access_token ở code trước).
    token_type:str = "bearer" 
    user:dict  # Một dict chứa info user (ví dụ: {"id": 1, "email": "...", "role": "user"}). Không phải schema riêng, linh hoạt.


class UserProfileSchema(BaseModel):
    id: str
    fullname: str
    phone: Optional[str]
    address: Optional[str]
    email: EmailStr
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)