from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.user import User
from app.schemas.user import (
    RegisterUserSchema, 
    RegisterResponseSchema,
    LoginSchema,
    TokenSchema
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", 
    response_model=RegisterResponseSchema,
    status_code=status.HTTP_201_CREATED
)
async def register_user(
    user_data: RegisterUserSchema,
    db: Session = Depends(get_db)
):
    """Đăng ký tài khoản mới"""
    # Kiểm tra email tồn tại
    stmt = select(User).where(User.email == user_data.email)
    exist_user = db.execute(stmt).scalar_one_or_none()
    if exist_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã tồn tại"
        )

    # Kiểm tra số điện thoại
    if user_data.phone:
        stmt = select(User).where(User.phone == user_data.phone)
        exist_phone = db.execute(stmt).scalar_one_or_none()
        if exist_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Số điện thoại đã được sử dụng"
            )

    # Tạo user mới
    import uuid
    new_user_id = str(uuid.uuid4())[:10]  # Rút ngắn cho đẹp
    hashed_pwd = get_password_hash(user_data.password)

    new_user = User(
        user_id=new_user_id,
        full_name=user_data.username,
        email=user_data.email,
        password=hashed_pwd,
        phone=user_data.phone,
        address=user_data.address,
        role='customer',
        created_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Quan trọng!

    return {
        "id": new_user.user_id,
        "fullname": new_user.full_name,
        "email": new_user.email,
        "phone": new_user.phone,
        "address": new_user.address,
        "created_at": new_user.created_at,
    }


@router.post("/login", response_model=TokenSchema)
async def login(
    login_data: LoginSchema,
    db: Session = Depends(get_db)
):
    """Đăng nhập"""
    # Tìm user theo phone hoặc email
    stmt = select(User).where(
        (User.phone == login_data.phone) | (User.email == login_data.phone)
    )
    user = db.execute(stmt).scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Thông tin đăng nhập không đúng"
        )

    # Tạo token
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


@router.get("/admin/users", dependencies=[Depends(require_admin)])
async def get_all_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Admin xem danh sách users"""
    from sqlalchemy import func
    
    total = db.execute(select(func.count()).select_from(User)).scalar()
    users = db.execute(select(User).offset(skip).limit(limit)).scalars().all()
    
    return {
        "total": total,
        "users": [
            {
                "id": u.user_id,
                "fullname": u.full_name,
                "email": u.email,
                "role": u.role,
                "created_at": u.created_at
            } for u in users
        ]
    }