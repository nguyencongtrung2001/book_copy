from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Dữ liệu chung
class ContactBase(BaseModel):
    subject: str
    message: str


# Dữ liệu khi KHÁCH HÀNG gửi liên hệ
class ContactCreate(ContactBase):
    user_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None


# Dữ liệu khi ADMIN phản hồi
class ContactReply(BaseModel):
    admin_response: str


# Dữ liệu trả về (Response)
class ContactResponse(ContactBase):
    contact_id: int
    user_id: Optional[str] = None
    full_name: str
    email: str
    status: str
    admin_response: Optional[str] = None
    sent_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None

    class Config:
        from_attributes = True