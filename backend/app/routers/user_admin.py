from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db

from app.schemas.user_admin import UserCreate, UserUpdate, UserResponse
from app.services import user_admin as user_service 

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_list_users(
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên, email, sđt"),
    role: Optional[str] = Query(None, description="Lọc theo quyền"),
    db: Session = Depends(get_db)
):
    return user_service.get_users(db, search_string=search, role_filter=role)

@router.get("/{user_id}", response_model=UserResponse)
def get_user_detail(user_id: str, db: Session = Depends(get_db)):
    db_user = user_service.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/", response_model=UserResponse)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    if user_service.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered") 

    return user_service.create_user(db, user)

@router.put("/{user_id}", response_model=UserResponse)
def update_existing_user(user_id: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = user_service.update_user(db, user_id, user_update)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}")
def delete_existing_user(user_id: str, db: Session = Depends(get_db)):
    is_deleted = user_service.delete_user(db, user_id)
    if not is_deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}