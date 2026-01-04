from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.services import order as order_service
from app.models.order import Order

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    return order_service.create_order(db, order_data)


@router.get("/my-orders/{user_id}", response_model=List[OrderResponse])
def get_my_orders(user_id: str, db: Session = Depends(get_db)):
    return order_service.get_user_orders(db, user_id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_detail(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}/status")
def update_order_status(order_id: str, new_status: str, db: Session = Depends(get_db)):
    updated_order = order_service.update_status(db, order_id, new_status)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {
        "message": "Status updated successfully",
        "new_status": updated_order.order_status,
    }