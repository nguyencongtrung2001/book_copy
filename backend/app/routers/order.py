from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderItemCreate
from app.services import order as order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Tạo đơn hàng mới
    - Yêu cầu đăng nhập
    - Tự động lấy user_id từ token
    """
    # Override user_id from token
    order_data.user_id = current_user.user_id
    
    return order_service.create_order(db, order_data)


@router.get("/my-orders", response_model=List[OrderResponse])
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy danh sách đơn hàng của user hiện tại"""
    return order_service.get_user_orders(db, current_user.user_id)


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_detail(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy chi tiết đơn hàng"""
    order = order_service.get_order_by_id(db, order_id)
    
    # Verify ownership (except admin)
    if current_user.role != 'admin' and order.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn hàng này"
        )
    
    return order


@router.put("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Hủy đơn hàng"""
    return order_service.cancel_order(db, order_id, current_user.user_id)


# Admin endpoints
@router.put("/admin/{order_id}/status")
async def update_order_status_admin(
    order_id: str,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật trạng thái đơn hàng (Admin only)
    Valid statuses: processing, confirmed, shipping, delivered, cancelled
    """
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ admin mới có quyền cập nhật trạng thái"
        )
    
    order = order_service.update_order_status(db, order_id, new_status)
    
    return {
        "message": "Cập nhật trạng thái thành công",
        "order_id": order.order_id,
        "new_status": order.order_status
    }