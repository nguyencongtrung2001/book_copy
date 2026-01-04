from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
from datetime import datetime


class OrderItemCreate(BaseModel):
    book_id: str
    quantity: int


class OrderCreate(BaseModel):
    user_id: str
    shipping_address: str
    payment_method_id: str
    voucher_code: Optional[str] = None
    items: List[OrderItemCreate]


class OrderDetailResponse(BaseModel):
    detail_id: int
    book_id: str
    quantity: int
    unit_price: Decimal

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    order_id: str
    user_id: str
    total_amount: Decimal
    order_status: str
    shipping_address: str
    payment_method_id: Optional[str]
    created_at: datetime
    order_details: List[OrderDetailResponse]

    class Config:
        from_attributes = True