
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.models.review import Review
from app.models.user import User
from app.models.order import Order
from app.models.order_detail import OrderDetail
from app.schemas.review import ReviewCreate, ReviewResponse, BookRatingSummary


# 1. Lấy danh sách đánh giá của một cuốn sách
def get_book_reviews(db: Session, book_id: str):
    reviews = (
        db.query(Review, User.full_name)
        .join(User, Review.user_id == User.user_id)
        .filter(Review.book_id == book_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    # Map dữ liệu để trả về kèm tên user
    result = []
    for r, name in reviews:
        item = ReviewResponse.from_orm(r)
        item.user_fullname = name
        result.append(item)
    return result


# 2. Gửi đánh giá mới
def create_review(db: Session, data: ReviewCreate):
    # 1. Kiểm tra đã mua hàng chưa
    has_purchased = (
        db.query(Order)
        .join(OrderDetail, Order.order_id == OrderDetail.order_id)
        .filter(
            Order.user_id == data.user_id,
            OrderDetail.book_id == data.book_id,
            Order.order_status == "completed",
        )
        .first()
    )

    if not has_purchased:
        raise HTTPException(
            status_code=403,
            detail="Quyền đánh giá chỉ dành cho khách hàng đã mua sản phẩm này.",
        )

    # 2. Kiểm tra giới hạn 24h
    one_day_ago = datetime.utcnow() - timedelta(days=1)
    recent_review = (
        db.query(Review)
        .filter(
            Review.book_id == data.book_id,
            Review.user_id == data.user_id,
            Review.created_at >= one_day_ago,
        )
        .first()
    )

    if recent_review:
        raise HTTPException(
            status_code=400,
            detail="Bạn đã gửi đánh giá gần đây. Vui lòng quay lại sau 24 giờ.",
        )

    # 3. Lấy thông tin User để lấy full_name
    user = db.query(User).filter(User.user_id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng.")

    # 4. Lưu đánh giá mới
    new_review = Review(
        book_id=data.book_id,
        user_id=data.user_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    # 5. Map dữ liệu vào Schema Response và gán tên user
    # Việc gán thủ công này giúp user_fullname xuất hiện ngay lập tức sau khi POST thành công
    response_data = ReviewResponse.from_orm(new_review)
    response_data.user_fullname = user.full_name

    return response_data


# 3. Thống kê điểm trung bình
def get_rating_summary(db: Session, book_id: str):
    stats = (
        db.query(
            func.avg(Review.rating).label("avg"),
            func.count(Review.review_id).label("count"),
        )
        .filter(Review.book_id == book_id)
        .first()
    )

    return {"average_rating": round(stats.avg or 0, 1), "total_reviews": stats.count}