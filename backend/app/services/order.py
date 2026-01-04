from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func, select
from fastapi import HTTPException
from datetime import datetime
import uuid

from app.models.order import Order
from app.models.order_detail import OrderDetail
from app.models.book import Book
from app.models.discount import Discount
from app.models.discount_application import DiscountApplication
from app.models.payment_method import PaymentMethod
from app.schemas.order import OrderCreate


def generate_order_id(db: Session) -> str:
    """Generate unique order ID"""
    # Get last order
    stmt = select(Order).order_by(Order.created_at.desc())
    last_order = db.execute(stmt).scalars().first()
    
    if not last_order:
        return "ORD00001"
    
    # Extract number from last order_id
    try:
        last_num = int(last_order.order_id[3:])
        new_num = last_num + 1
        return f"ORD{new_num:05d}"
    except:
        # Fallback to UUID if parsing fails
        return f"ORD{str(uuid.uuid4().int)[:8]}"


def create_order(db: Session, order_data: OrderCreate):
    """Create new order with validation"""
    try:
        # 1. Validate payment method
        stmt = select(PaymentMethod).where(
            PaymentMethod.payment_method_id == order_data.payment_method_id
        )
        payment_method = db.execute(stmt).scalar_one_or_none()
        
        if not payment_method:
            raise HTTPException(
                status_code=400,
                detail="Phương thức thanh toán không hợp lệ"
            )
        
        # 2. Calculate subtotal and validate stock
        subtotal = Decimal(0)
        order_items_to_save = []
        
        for item in order_data.items:
            # Get book
            stmt = select(Book).where(Book.book_id == item.book_id)
            book = db.execute(stmt).scalar_one_or_none()
            
            if not book:
                raise HTTPException(
                    status_code=404,
                    detail=f"Sách {item.book_id} không tồn tại"
                )
            
            # Check stock
            if book.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Không đủ hàng cho sách '{book.title}'. Còn lại: {book.stock_quantity}"
                )
            
            # Calculate item total
            item_total = Decimal(str(book.price)) * item.quantity
            subtotal += item_total
            
            # Prepare order detail
            order_items_to_save.append({
                'book': book,
                'quantity': item.quantity,
                'unit_price': book.price
            })
        
        # 3. Apply discount if provided
        total_amount = subtotal
        discount_id = None
        
        if order_data.voucher_code:
            stmt = select(Discount).where(
                Discount.voucher_code == order_data.voucher_code,
                Discount.expiry_date >= datetime.utcnow()
            )
            discount = db.execute(stmt).scalar_one_or_none()
            
            if discount:
                discount_value = subtotal * (Decimal(str(discount.discount_percentage)) / 100)
                total_amount = subtotal - discount_value
                discount_id = discount.discount_id
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Mã giảm giá không hợp lệ hoặc đã hết hạn"
                )
        
        # 4. Generate order ID
        new_order_id = generate_order_id(db)
        
        # 5. Create order
        new_order = Order(
            order_id=new_order_id,
            user_id=order_data.user_id,
            total_amount=total_amount,
            shipping_address=order_data.shipping_address,
            payment_method_id=order_data.payment_method_id,
            order_status='processing',
            created_at=datetime.utcnow()
        )
        
        db.add(new_order)
        db.flush()  # Get order_id without committing
        
        # 6. Create order details and update stock
        for item_data in order_items_to_save:
            book = item_data['book']
            
            # Create order detail
            order_detail = OrderDetail(
                order_id=new_order_id,
                book_id=book.book_id,
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price']
            )
            db.add(order_detail)
            
            # Update stock and sold quantity
            book.stock_quantity -= item_data['quantity']
            book.sold_quantity += item_data['quantity']
        
        # 7. Apply discount if exists
        if discount_id:
            discount_app = DiscountApplication(
                order_id=new_order_id,
                discount_id=discount_id
            )
            db.add(discount_app)
        
        # 8. Commit transaction
        db.commit()
        db.refresh(new_order)
        
        return new_order
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi tạo đơn hàng: {str(e)}"
        )


def get_user_orders(db: Session, user_id: str):
    """Get all orders for a user"""
    stmt = select(Order).where(
        Order.user_id == user_id
    ).order_by(Order.created_at.desc())
    
    orders = db.execute(stmt).scalars().all()
    return orders


def get_order_by_id(db: Session, order_id: str):
    """Get order by ID with details"""
    stmt = select(Order).where(Order.order_id == order_id)
    order = db.execute(stmt).scalar_one_or_none()
    
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy đơn hàng"
        )
    
    return order


def update_order_status(db: Session, order_id: str, new_status: str):
    """Update order status"""
    valid_statuses = ['processing', 'confirmed', 'shipping', 'delivered', 'cancelled']
    
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail="Trạng thái không hợp lệ"
        )
    
    order = get_order_by_id(db, order_id)
    order.order_status = new_status
    
    db.commit()
    db.refresh(order)
    
    return order


def cancel_order(db: Session, order_id: str, user_id: str):
    """Cancel order and restore stock"""
    try:
        order = get_order_by_id(db, order_id)
        
        # Verify ownership
        if order.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="Bạn không có quyền hủy đơn hàng này"
            )
        
        # Check if can cancel
        if order.order_status in ['delivered', 'cancelled']:
            raise HTTPException(
                status_code=400,
                detail="Không thể hủy đơn hàng đã giao hoặc đã hủy"
            )
        
        # Restore stock
        for detail in order.order_details:
            book = detail.book
            book.stock_quantity += detail.quantity
            book.sold_quantity -= detail.quantity
        
        # Update status
        order.order_status = 'cancelled'
        
        db.commit()
        db.refresh(order)
        
        return order
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi hủy đơn hàng: {str(e)}"
        )