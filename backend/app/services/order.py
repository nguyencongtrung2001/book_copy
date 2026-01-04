from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from app.models.order import Order
from app.models.order_detail import OrderDetail
from app.models.book import Book
from app.models.discount import DiscountCode
from app.models.discount_application import DiscountApplication
from app.schemas.order import OrderCreate


# Decimal cho tính toán tiền chính xác
def generate_order_id(db: Session):
    last_order = db.query(Order.order_id).order_by(Order.order_id.desc()).first()
    if not last_order:
        return "O001"
    current_num = int(last_order[0][1:])
    return f"O{current_num + 1:03d}"


# Tạo đơn hàng mới
def create_order(db: Session, order_data: OrderCreate):
    new_order_id = generate_order_id(db)
    subtotal = Decimal(0)
    order_items_to_save = []

    # 1. Kiểm tra tồn kho và tính tổng tiền
    for item in order_data.items:
        book = db.query(Book).filter(Book.book_id == item.book_id).first()
        if not book:
            raise HTTPException(
                status_code=404, detail=f"Book {item.book_id} not found"
            )

        if book.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400, detail=f"Not enough stock for {book.title}"
            )

        # Tính toán tiền
        item_price = book.price * item.quantity
        subtotal += item_price

        # Cập nhật tồn kho và đã bán
        book.stock_quantity -= item.quantity
        book.sold_quantity += item.quantity

        order_items_to_save.append(
            OrderDetail(
                order_id=new_order_id,
                book_id=book.book_id,
                quantity=item.quantity,
                unit_price=book.price,
            )
        )

    # 2. Xử lý giảm giá (Voucher)
    total_amount = subtotal
    applied_discount_id = None

    if order_data.voucher_code:
        voucher = (
            db.query(DiscountCode)
            .filter(
                DiscountCode.voucher_code == order_data.voucher_code,
                DiscountCode.expiry_date >= func.now(),
            )
            .first()
        )

        if voucher:
            discount_value = subtotal * (voucher.discount_percentage / 100)
            total_amount = subtotal - discount_value
            applied_discount_id = voucher.discount_id
        else:
            raise HTTPException(status_code=400, detail="Invalid or expired voucher")

    # 3. Lưu Order
    new_order = Order(
        order_id=new_order_id,
        user_id=order_data.user_id,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        payment_method_id=order_data.payment_method_id,
        order_status="processing",
    )

    db.add(new_order)
    db.add_all(order_items_to_save)

    # 4. Lưu vào bảng trung gian discount_applications nếu có
    if applied_discount_id:
        db.add(
            DiscountApplication(order_id=new_order_id, discount_id=applied_discount_id)
        )

    db.commit()
    db.refresh(new_order)
    return new_order


# Lấy đơn hàng theo User ID
def get_user_orders(db: Session, user_id: str):
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


# Cập nhật trạng thái đơn hàng
def update_status(db: Session, order_id: str, status: str):
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if order:
        order.order_status = status
        db.commit()
        db.refresh(order)
    return order