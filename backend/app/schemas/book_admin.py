from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime


# Class cơ bản chứa các trường chung
class BookBase(BaseModel):
    title: str
    author: str
    publisher: Optional[str] = None
    publishyear: Optional[int] = None
    categoryid: Optional[int] = None
    price: Decimal
    stock: Optional[int] = 0
    description: Optional[str] = None
    imageurl: Optional[str] = None


# Schema để Validate dữ liệu khi tạo mới (Create)
class BookCreate(BookBase):
    pass


# Schema để Validate dữ liệu khi cập nhật (Update) - Cho phép tất cả field là None
class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None
    publishyear: Optional[int] = None
    categoryid: Optional[int] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    imageurl: Optional[str] = None


# Schema để trả về dữ liệu cho Frontend (Response)
class BookResponse(BookBase):
    id: int
    createdat: datetime

    class Config:
        from_attributes = True