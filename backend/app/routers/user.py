from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select
from uuid import uuid4
from app.core.security import get_password_hash
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import RegisterUserSchema, RegisterResponseSchema

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register",summary="Đăng ký người dùng mới",response_model=RegisterResponseSchema)
async def register_user(
    user_data: RegisterUserSchema,
    db: AsyncSession = Depends(get_db)
):
    # 1️⃣ Check email tồn tại (ASYNC)
    stmt = select(User).where(User.email == user_data.email)
    result = await db.execute(stmt)
    exist_user = result.scalar_one_or_none()

    if exist_user:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")

    # 2️⃣ Insert (generate user_id and hash password)
    new_user_id = uuid4().hex[:10]
    hashed_pwd = get_password_hash(user_data.password)

    stmt = insert(User).values(
        user_id=new_user_id,
        full_name=user_data.username,
        email=user_data.email,
        password=hashed_pwd,
        phone=user_data.phone,
        address=user_data.address
    )

    await db.execute(stmt)
    await db.commit()

    # 3️⃣ Lấy user vừa tạo
    stmt = select(User).where(User.user_id == new_user_id)
    result = await db.execute(stmt)
    new_user = result.scalar_one()

    # Trả về dict khớp với frontend (id là chuỗi), và schema response sẽ xác thực
    return {
        "id": new_user.user_id,
        "fullname": new_user.full_name,
        "email": new_user.email,
        "phone": new_user.phone,
        "address": new_user.address,
        "created_at": new_user.created_at,
    }
