from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Import Database function (Sửa lại đường dẫn import nếu file database.py của bạn nằm chỗ khác trong core)
from app.core.database import get_db

# Import Model và Schema vừa tạo
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate, BookResponse

router = APIRouter(prefix="/books", tags=["Books"])


# 1. Lấy danh sách Books (có phân trang)
@router.get("/", response_model=List[BookResponse])
def get_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = db.query(Book).offset(skip).limit(limit).all()
    return books


# 2. Lấy chi tiết 1 Book theo ID
@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# 3. Thêm Book mới
@router.post("/", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(book_data: BookCreate, db: Session = Depends(get_db)):
    # Chuyển đổi từ Schema sang Model
    new_book = Book(
        title=book_data.title,
        author=book_data.author,
        publisher=book_data.publisher,
        publishyear=book_data.publishyear,
        categoryid=book_data.categoryid,
        price=book_data.price,
        stock=book_data.stock,
        description=book_data.description,
        imageurl=book_data.imageurl,
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book


# 4. Cập nhật Book
@router.put("/{book_id}", response_model=BookResponse)
def update_book(book_id: int, book_update: BookUpdate, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Lấy những trường có giá trị (loại bỏ null) để cập nhật
    update_data = book_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(book, key, value)  # Cập nhật thuộc tính tương ứng

    db.commit()
    db.refresh(book)
    return book


# 5. Xóa Book
@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(book)
    db.commit()
    return None