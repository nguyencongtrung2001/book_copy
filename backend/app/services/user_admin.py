from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.user import User
from app.schemas.user_admin import UserCreate, UserUpdate
from sqlalchemy import desc

def get_users(db: Session, search_string: str = None, role_filter: str = None):
    query = db.query(User)

    if search_string:
        search = f"%{search_string}%"
        query = query.filter(
            or_(
                User.full_name.like(search),
                User.email.like(search),
                User.phone.like(search)
            )
        )

    if role_filter:
        query = query.filter(User.role == role_filter)

    return query.all()

def get_user_by_id(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def generate_new_user_id(db: Session) -> str:
    last_user = db.query(User).order_by(desc(User.user_id)).first()
    if not last_user:
        return "U00000001"
    
    last_id = last_user.user_id
    number_part = last_id[1:] # Lấy phần số bỏ qua chữ "U"
    
    try:
        next_number = int(number_part) + 1
        new_id = f"U{next_number:08d}" 
        return new_id
    except ValueError:
        return f"U{db.query(User).count() + 1:08d}"
    
def create_user(db: Session, user: UserCreate):
    new_id = generate_new_user_id(db)
    new_user = User(
        user_id=new_id,
        email=user.email,
        full_name=user.full_name,
        password=user.password, 
        phone=user.phone,
        address=user.address,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def update_user(db: Session, user_id: str, user_update: UserUpdate):
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str):
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False