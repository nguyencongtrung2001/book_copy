from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update
from uuid import uuid4
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, require_customer
from app.models.user import User
from app.schemas.user import (
    RegisterUserSchema, 
    RegisterResponseSchema,
    LoginSchema,
    TokenSchema,
    UserProfileSchema,
    UpdateProfileSchema
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", 
    summary="Đăng ký người dùng mới", 
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

    # Tạo user mới - FIXED: Dùng full UUID
    import uuid  # Thêm nếu chưa có
    new_user_id = str(uuid.uuid4())  # Full UUID, an toàn hơn
    hashed_pwd = get_password_hash(user_data.password)

    stmt = insert(User).values(
        user_id=new_user_id,
        full_name=user_data.username,  # Giả sử schema có username
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

@router.post("/login", 
    summary="Đăng nhập", 
    response_model=TokenSchema
)
async def login(
    login_data: LoginSchema,
    db: Session = Depends(get_db)
):
    """Đăng nhập vào hệ thống - FIXED: Search by phone OR email"""
    # Tìm user theo phone HOẶC email
    stmt = select(User).where(
        (User.phone == login_data.phone) | (User.email == login_data.email)  # Giả sử schema có email field
    )
    result = db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Thông tin đăng nhập không đúng"  # Chung chung hơn
        )

    # Kiểm tra mật khẩu
    if not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Thông tin đăng nhập không đúng"
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

# ... (các hàm khác giữ nguyên)

@router.get("/admin/users",
    summary="[Admin] Lấy danh sách users",
    dependencies=[Depends(require_admin)]
)
async def get_all_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Chỉ admin mới xem được danh sách user - FIXED: True total count"""
    from sqlalchemy import func  # Thêm import
    # Đếm total
    total_stmt = select(func.count()).select_from(User)
    total_result = db.execute(total_stmt)
    total = total_result.scalar()

    # Lấy users
    stmt = select(User).offset(skip).limit(limit)
    result = db.execute(stmt)
    users = result.scalars().all()
    
    return {
        "total": total,  # True total
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