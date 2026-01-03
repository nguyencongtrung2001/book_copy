from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.contact import ContactCreate, ContactReply, ContactResponse
from app.services import contact as contact_service

router = APIRouter(prefix="/contacts", tags=["Contacts"])


# 1. Gửi liên hệ mới
@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(contact_data: ContactCreate, db: Session = Depends(get_db)):
    return contact_service.create(db, contact_data)


# 2. Lấy danh sách liên hệ với phân trang và lọc trạng thái
@router.get("/", response_model=List[ContactResponse])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return contact_service.get_all(db, skip, limit, status)


# 3. Lấy chi tiết liên hệ theo ID
@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact_detail(contact_id: int, db: Session = Depends(get_db)):
    contact = contact_service.get_by_id(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


# 4. Phản hồi liên hệ (dành cho ADMIN)
@router.put("/{contact_id}/reply", response_model=ContactResponse)
def reply_contact(
    contact_id: int, reply_data: ContactReply, db: Session = Depends(get_db)
):
    contact = contact_service.respond(db, contact_id, reply_data)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


# 5. Xoá liên hệ (dành cho ADMIN)
@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    success = contact_service.delete(db, contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return None