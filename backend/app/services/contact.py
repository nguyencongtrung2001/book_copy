from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException
from app.models.contact import Contact
from app.models.user import User  # <--- Import Model User
from app.schemas.contact import ContactCreate, ContactReply


# 1. Lấy danh sách liên hệ
def get_all(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(Contact)
    if status:
        query = query.filter(Contact.status == status)
    return query.order_by(Contact.sent_at.desc()).offset(skip).limit(limit).all()


# 2. Lấy chi tiết liên hệ
def get_by_id(db: Session, contact_id: int):
    return db.query(Contact).filter(Contact.contact_id == contact_id).first()


# 3. Gửi liên hệ (Logic mới)
def create(db: Session, contact_data: ContactCreate):
    # Khởi tạo biến tạm
    final_full_name = contact_data.full_name
    final_email = contact_data.email

    # TRƯỜNG HỢP 1: Có User ID -> Tự động lấy thông tin từ bảng Users
    if contact_data.user_id:
        user = db.query(User).filter(User.user_id == contact_data.user_id).first()
        if not user:
            # Nếu truyền user_id bậy bạ không tồn tại thì báo lỗi
            raise HTTPException(status_code=404, detail="User ID not found")

        # Gán tự động dữ liệu từ User
        final_full_name = user.full_name
        final_email = user.email

    # TRƯỜNG HỢP 2: Khách vãng lai (Không có User ID) -> Bắt buộc phải nhập tay
    else:
        if not final_full_name or not final_email:
            raise HTTPException(
                status_code=400, detail="Full name and Email are required for guests"
            )

    # Tạo record mới với dữ liệu đã xử lý
    new_contact = Contact(
        user_id=contact_data.user_id,
        full_name=final_full_name,
        email=final_email,
        subject=contact_data.subject,
        message=contact_data.message,
        status="pending",
        sent_at=datetime.utcnow(),
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact


# 4. Phản hồi liên hệ
def respond(db: Session, contact_id: int, reply_data: ContactReply):
    contact = get_by_id(db, contact_id)
    if not contact:
        return None

    contact.admin_response = reply_data.admin_response
    contact.status = "resolved"
    contact.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(contact)
    return contact


# 5. Xóa liên hệ
def delete(db: Session, contact_id: int):
    contact = get_by_id(db, contact_id)
    if not contact:
        return False

    db.delete(contact)
    db.commit()
    return True