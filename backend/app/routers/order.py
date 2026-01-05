# backend/app/routers/order.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderItemCreate
from app.services import order as order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", status_code=status.HTTP_201_CREATED)
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
    
    print("=" * 60)
    print("📦 RECEIVED ORDER DATA:")
    print(f"   Raw data: {order_data}")
    print(f"   User ID from token: {current_user.user_id}")
    print(f"   User name: {current_user.full_name}")
    print("=" * 60)
    
    try:
        order_data.user_id = current_user.user_id
        
        print(f"✅ Order data after user_id assignment:")
        print(f"   user_id: {order_data.user_id}")
        print(f"   shipping_address: {order_data.shipping_address}")
        print(f"   payment_method_id: {order_data.payment_method_id}")
        print(f"   voucher_code: {order_data.voucher_code}")
        print(f"   items: {order_data.items}")
        
        result = order_service.create_order(db, order_data)
        
        print("✅ ORDER CREATED SUCCESSFULLY!")
        
        # Manually construct response with order_status
        return {
            "order_id": result.order_id,
            "user_id": result.user_id,
            "total_amount": result.total_amount,
            "status_id": result.status_id,
            "order_status": result.status.status_name if result.status else "unknown",
            "shipping_address": result.shipping_address,
            "payment_method_id": result.payment_method_id,
            "created_at": result.created_at,
            "order_details": result.order_details
        }
        
    except Exception as e:
        print(f"❌ ERROR creating order: {str(e)}")
        print(f"   Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise


@router.get("/my-orders")
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy danh sách đơn hàng của user hiện tại"""
    orders = order_service.get_user_orders(db, current_user.user_id)
    
    # Manually construct response list
    return [
        {
            "order_id": order.order_id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "status_id": order.status_id,
            "order_status": order.status.status_name if order.status else "unknown",
            "shipping_address": order.shipping_address,
            "payment_method_id": order.payment_method_id,
            "created_at": order.created_at,
            "order_details": order.order_details
        }
        for order in orders
    ]


@router.get("/{order_id}")
async def get_order_detail(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy chi tiết đơn hàng"""
    order = order_service.get_order_by_id(db, order_id)
    
    if current_user.role != 'admin' and order.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xem đơn hàng này"
        )
    
    return {
        "order_id": order.order_id,
        "user_id": order.user_id,
        "total_amount": order.total_amount,
        "status_id": order.status_id,
        "order_status": order.status.status_name if order.status else "unknown",
        "shipping_address": order.shipping_address,
        "payment_method_id": order.payment_method_id,
        "created_at": order.created_at,
        "order_details": order.order_details
    }


@router.put("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Hủy đơn hàng"""
    order = order_service.cancel_order(db, order_id, current_user.user_id)
    
    return {
        "order_id": order.order_id,
        "user_id": order.user_id,
        "total_amount": order.total_amount,
        "status_id": order.status_id,
        "order_status": order.status.status_name if order.status else "unknown",
        "shipping_address": order.shipping_address,
        "payment_method_id": order.payment_method_id,
        "created_at": order.created_at,
        "order_details": order.order_details
    }


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
    Valid statuses: processing, confirmed, shipping, completed, cancelled
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
        "new_status": order.status.status_name
    }