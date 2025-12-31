from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Tạo hash mật khẩu
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 3. Hàm verify_password (kiểm tra mật khẩu)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    # plain_password: Mật khẩu người dùng gõ (ví dụ: "123abc").
    # hashed_password: Mật khẩu đã hash từ DB (ví dụ: "$2b$12$...").
    """
    return pwd_context.verify(plain_password, hashed_password)  # pwd_context.verify(...): Máy hash sẽ hash lại plain_password và so sánh với hashed_password. Nếu giống nhau → True. An toàn vì bcrypt tự thêm muối.

# 4. Hàm get_password_hash (Tạo hash mật khẩu) - FIXED
def get_password_hash(password: str) -> str:
    """Tạo hash mật khẩu từ mật khẩu gốc."""
    # Truncate nếu >72 bytes (bcrypt limit)
    if len(password.encode('utf-8')) > 72:
        truncated = password.encode('utf-8')[:72].decode('utf-8')
        logger.warning(f"Password truncated from {len(password)} chars to 72 bytes: {password[:20]}...")
        password = truncated
    return pwd_context.hash(password)  # Trả về chuỗi đã hash (ví dụ: "$2b$12$...").

# 5. Hàm create_access_token (Tạo Token JWT) - Không thay đổi
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """ Tạo JWT access token
    data: Dữ liệu để mã hóa trong token (thường là thông tin user).  data: Dict chứa info user, ví dụ {"user_id": 123, "email": "user@example.com"}.
    expires_delta: Thời gian hết hạn tùy chỉnh (ví dụ: 1 giờ). Nếu không có, dùng mặc định từ settings (ví dụ: 30 phút).
    return : Trả về chuỗi token đã mã hóa. Chuỗi token JWT (dài, như "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...").
    """
    to_encode = data.copy()  # Sao chép dict data để không thay đổi bản gốc (an toàn).

    # Tính thời gian hết hạn
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# 6. Hàm decode_access_token (Giải mã và verify JWT token) - Không thay đổi
def decode_access_token(token: str) -> Optional[dict]:
    """Giải mã JWT access token
    token: Chuỗi token JWT nhận được từ client.
    return: Trả về dict dữ liệu giải mã (thông tin user) nếu thành công, ngược lại trả về None.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload  # Trả về dict dữ liệu giải mã (thông tin user).
    except JWTError:
        return None  # Giải mã thất bại (token không hợp lệ hoặc hết hạn).