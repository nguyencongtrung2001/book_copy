# backend/app/schemas/order.py
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from decimal import Decimal
from datetime import datetime


class OrderItemCreate(BaseModel):
    """Schema để tạo item trong đơn hàng"""
    book_id: str = Field(..., description="ID của sách")
    quantity: int = Field(..., gt=0, description="Số lượng (phải > 0)")
    
    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    """
    Schema để tạo đơn hàng mới
    ⚠️ QUAN TRỌNG: user_id sẽ được backend tự động gán từ token
    Frontend KHÔNG cần gửi user_id
    """
    shipping_address: str = Field(..., min_length=5, description="Địa chỉ giao hàng")
    payment_method_id: str = Field(..., description="ID phương thức thanh toán")
    voucher_code: Optional[str] = Field(None, description="Mã giảm giá (nếu có)")
    items: List[OrderItemCreate] = Field(..., min_items=1, description="Danh sách sản phẩm")
    
    user_id: Optional[str] = Field(None, description="User ID (tự động từ token)")
    
    model_config = {"from_attributes": True}
    
    @field_validator('items')
    @classmethod
    def validate_items(cls, v):
        if not v or len(v) == 0:
            raise ValueError('Đơn hàng phải có ít nhất 1 sản phẩm')
        return v


class OrderDetailResponse(BaseModel):
    """Schema response cho order detail"""
    detail_id: int
    book_id: str
    quantity: int
    unit_price: Decimal

    model_config = {"from_attributes": True}


class OrderStatusResponse(BaseModel):
    """Schema cho thông tin trạng thái"""
    status_id: str
    status_name: str
    
    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    """
    Schema response cho order
    Note: order_status được tính từ relationship status.status_name
    """
    order_id: str
    user_id: str
    total_amount: Decimal
    status_id: str
    order_status: str  # Tên trạng thái (processing, confirmed, etc.)
    shipping_address: str
    payment_method_id: Optional[str]
    created_at: datetime
    order_details: List[OrderDetailResponse]

    model_config = {"from_attributes": True}