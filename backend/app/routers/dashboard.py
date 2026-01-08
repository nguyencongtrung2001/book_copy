from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func, extract, and_
from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.models.order import Order
from app.models.order_status import OrderStatus
from app.models.book import Book

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Lấy thống kê tổng quan cho dashboard"""
    
    try:
        # Tổng số users
        total_users = db.execute(select(func.count()).select_from(User)).scalar()
        total_customers = db.execute(
            select(func.count()).select_from(User).where(User.role == 'customer')
        ).scalar()
        total_admins = db.execute(
            select(func.count()).select_from(User).where(User.role == 'admin')
        ).scalar()
        
        # Tổng số đơn hàng
        total_orders = db.execute(select(func.count()).select_from(Order)).scalar()
        
        # Tổng doanh thu
        total_revenue = db.execute(
            select(func.sum(Order.total_amount))
            .select_from(Order)
            .join(OrderStatus)
            .where(OrderStatus.status_name == 'completed')
        ).scalar() or 0
        
        # Tổng số sách
        total_books = db.execute(select(func.count()).select_from(Book)).scalar()
        total_stock = db.execute(select(func.sum(Book.stock_quantity)).select_from(Book)).scalar() or 0
        total_sold = db.execute(select(func.sum(Book.sold_quantity)).select_from(Book)).scalar() or 0
        
        return {
            "users": {
                "total": total_users,
                "customers": total_customers,
                "admins": total_admins
            },
            "orders": {
                "total": total_orders
            },
            "revenue": {
                "total": float(total_revenue)
            },
            "books": {
                "total": total_books,
                "stock": total_stock,
                "sold": total_sold
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi lấy thống kê: {str(e)}"
        )


@router.get("/order-status")
async def get_order_status_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Lấy thống kê đơn hàng theo trạng thái"""
    
    try:
        # Lấy tất cả trạng thái
        status_list = ['processing', 'confirmed', 'shipping', 'completed', 'cancelled']
        
        result = {}
        for status_name in status_list:
            # Đếm số đơn hàng
            count = db.execute(
                select(func.count())
                .select_from(Order)
                .join(OrderStatus)
                .where(OrderStatus.status_name == status_name)
            ).scalar() or 0
            
            # Tính tổng tiền
            total = db.execute(
                select(func.sum(Order.total_amount))
                .select_from(Order)
                .join(OrderStatus)
                .where(OrderStatus.status_name == status_name)
            ).scalar() or 0
            
            result[status_name] = {
                "count": count,
                "amount": float(total)
            }
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi lấy thống kê trạng thái: {str(e)}"
        )


@router.get("/monthly-trends")
async def get_monthly_trends(
    months: int = 6,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Lấy xu hướng theo tháng (6 tháng gần nhất)"""
    
    try:
        # Tính ngày bắt đầu (6 tháng trước)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30 * months)
        
        # Lấy danh sách tháng
        month_labels = []
        current = start_date
        while current <= end_date:
            month_labels.append(current.strftime('%m/%Y'))
            # Chuyển sang tháng tiếp theo
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)
        
        # Lấy dữ liệu đơn hàng theo tháng
        delivered = []
        cancelled = []
        revenue = []
        
        for i in range(len(month_labels)):
            month_start = start_date.replace(day=1) + timedelta(days=30 * i)
            if month_start.month == 12:
                month_end = month_start.replace(year=month_start.year + 1, month=1, day=1)
            else:
                month_end = month_start.replace(month=month_start.month + 1, day=1)
            
            # Đơn đã giao
            delivered_count = db.execute(
                select(func.count())
                .select_from(Order)
                .join(OrderStatus)
                .where(
                    and_(
                        OrderStatus.status_name == 'completed',
                        Order.created_at >= month_start,
                        Order.created_at < month_end
                    )
                )
            ).scalar() or 0
            delivered.append(delivered_count)
            
            # Đơn đã hủy
            cancelled_count = db.execute(
                select(func.count())
                .select_from(Order)
                .join(OrderStatus)
                .where(
                    and_(
                        OrderStatus.status_name == 'cancelled',
                        Order.created_at >= month_start,
                        Order.created_at < month_end
                    )
                )
            ).scalar() or 0
            cancelled.append(cancelled_count)
            
            # Doanh thu (chỉ đơn hoàn thành)
            month_revenue = db.execute(
                select(func.sum(Order.total_amount))
                .select_from(Order)
                .join(OrderStatus)
                .where(
                    and_(
                        OrderStatus.status_name == 'completed',
                        Order.created_at >= month_start,
                        Order.created_at < month_end
                    )
                )
            ).scalar() or 0
            revenue.append(float(month_revenue))
        
        return {
            "months": month_labels,
            "delivered": delivered,
            "cancelled": cancelled,
            "revenue": revenue
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi lấy xu hướng tháng: {str(e)}"
        )