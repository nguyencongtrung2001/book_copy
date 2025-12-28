from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, insert
from uuid import uuid4
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import (
    RegisterUserSchema, 
    RegisterResponseSchema,
    LoginSchema,
    TokenSchema,
    UserProfileSchema
)
from typing import Optional

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", summary="Đăng ký người dùng mới", response_model=RegisterResponseSchema)
async def register_user(
    user_data: RegisterUserSchema,
    db: Session = Depends(get_db)
):
    """Đăng ký tài khoản mới"""
    # Kiểm tra email tồn tại
    stmt = select(User).where(User.email == user_data.email)
    result = db.execute(stmt)
    exist_user = result.scalar_one_or_none()

    if exist_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã tồn tại"
        )

    # Kiểm tra số điện thoại tồn tại
    if user_data.phone:
        stmt = select(User).where(User.phone == user_data.phone)
        result = db.execute(stmt)
        exist_phone = result.scalar_one_or_none()
        if exist_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Số điện thoại đã được sử dụng"
            )

    # Tạo user mới
    new_user_id = uuid4().hex[:10]
    hashed_pwd = get_password_hash(user_data.password)

    stmt = insert(User).values(
        user_id=new_user_id,
        full_name=user_data.username,
        email=user_data.email,
        password=hashed_pwd,
        phone=user_data.phone,
        address=user_data.address,
        role='customer'  # Mặc định là customer
    )

    db.execute(stmt)
    db.commit()

    # Lấy user vừa tạo
    stmt = select(User).where(User.user_id == new_user_id)
    result = db.execute(stmt)
    new_user = result.scalar_one()

    return {
        "id": new_user.user_id,
        "fullname": new_user.full_name,
        "email": new_user.email,
        "phone": new_user.phone,
        "address": new_user.address,
        "created_at": new_user.created_at,
    }


@router.post("/login", summary="Đăng nhập", response_model=TokenSchema)
async def login(
    login_data: LoginSchema,
    db: Session = Depends(get_db)
):
    """Đăng nhập vào hệ thống"""
    # Tìm user theo phone
    stmt = select(User).where(User.phone == login_data.phone)
    result = db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Số điện thoại hoặc mật khẩu không đúng"
        )

    # Kiểm tra mật khẩu
    if not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Số điện thoại hoặc mật khẩu không đúng"
        )

    # Tạo access token với thông tin user
    access_token = create_access_token(
        data={
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.user_id,
            "fullname": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "role": user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }


@router.get("/profile", summary="Lấy thông tin profile", response_model=UserProfileSchema)
async def get_profile(
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)  # Sẽ implement sau
):
    """Lấy thông tin profile của user đang đăng nhập"""
    # TODO: Implement get_current_user dependency
    pass