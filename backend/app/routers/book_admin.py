from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, or_
from typing import Optional
import uuid

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.models.book import Book
from app.models.category import Category
from app.models.user import User
from app.schemas.book_admin import (
    BookCreateAdmin, 
    BookUpdateAdmin, 
    BookResponseAdmin,
    BookListResponseAdmin
)

router = APIRouter(prefix="/admin/books", tags=["Admin - Books"])


@router.get("/", response_model=BookListResponseAdmin)
async def get_all_books_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Lấy danh sách tất cả sách (Admin) - có phân trang"""
    
    # Build query đơn giản
    stmt = select(Book).options(joinedload(Book.category))
    
    # Count total
    count_stmt = select(func.count()).select_from(Book)
    total = db.execute(count_stmt).scalar()
    
    # Get books with pagination
    stmt = stmt.offset(skip).limit(limit).order_by(Book.created_at.desc())
    result = db.execute(stmt)
    books = result.scalars().all()
    
    # Chuyển đổi thủ công để đảm bảo có category_name
    books_data = []
    for book in books:
        books_data.append({
            "book_id": book.book_id,
            "title": book.title,
            "author": book.author,
            "publisher": book.publisher,
            "publication_year": book.publication_year,
            "category_id": book.category_id,
            "category_name": book.category.category_name if book.category else None,
            "price": book.price,
            "stock_quantity": book.stock_quantity,
            "sold_quantity": book.sold_quantity,
            "description": book.description,
            "cover_image_url": book.cover_image_url,
            "created_at": book.created_at,
            "updated_at": book.updated_at,
        })
    
    return {
        "total": total,
        "books": books_data
    }


@router.get("/{book_id}", response_model=BookResponseAdmin)
async def get_book_detail_admin(
    book_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Lấy chi tiết một cuốn sách (Admin)"""
    
    stmt = select(Book).options(joinedload(Book.category)).where(Book.book_id == book_id)
    result = db.execute(stmt)
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sách"
        )
    
    return BookResponseAdmin.model_validate(book)


@router.post("/", response_model=BookResponseAdmin, status_code=status.HTTP_201_CREATED)
async def create_book_admin(
    book_data: BookCreateAdmin,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Tạo sách mới (Admin)"""
    
    # Kiểm tra category tồn tại
    stmt = select(Category).where(Category.category_id == book_data.category_id)
    category = db.execute(stmt).scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thể loại không tồn tại"
        )
    
    # Tạo book_id tự động
    new_book_id = f"B{str(uuid.uuid4().int)[:8]}"
    
    # Tạo book mới
    new_book = Book(
        book_id=new_book_id,
        title=book_data.title,
        author=book_data.author,
        publisher=book_data.publisher,
        publication_year=book_data.publication_year,
        category_id=book_data.category_id,
        price=book_data.price,
        stock_quantity=book_data.stock_quantity,
        sold_quantity=0,
        description=book_data.description,
        cover_image_url=book_data.cover_image_url
    )
    
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    
    # Load lại với category
    stmt = select(Book).options(joinedload(Book.category)).where(Book.book_id == new_book_id)
    result = db.execute(stmt)
    book = result.scalar_one()
    
    return BookResponseAdmin.model_validate(book)


@router.put("/{book_id}", response_model=BookResponseAdmin)
async def update_book_admin(
    book_id: str,
    book_data: BookUpdateAdmin,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Cập nhật thông tin sách (Admin)"""
    
    # Tìm book
    stmt = select(Book).where(Book.book_id == book_id)
    result = db.execute(stmt)
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sách"
        )
    
    # Kiểm tra category nếu có update
    if book_data.category_id:
        stmt = select(Category).where(Category.category_id == book_data.category_id)
        category = db.execute(stmt).scalar_one_or_none()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Thể loại không tồn tại"
            )
    
    # Update các field
    update_data = book_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(book, key, value)
    
    db.commit()
    db.refresh(book)
    
    # Load lại với category
    stmt = select(Book).options(joinedload(Book.category)).where(Book.book_id == book_id)
    result = db.execute(stmt)
    book = result.scalar_one()
    
    return BookResponseAdmin.model_validate(book)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book_admin(
    book_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Xóa sách (Admin)"""
    
    stmt = select(Book).where(Book.book_id == book_id)
    result = db.execute(stmt)
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sách"
        )
    
    # Kiểm tra xem sách đã có trong đơn hàng chưa
    if book.order_details:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Không thể xóa sách đã có trong đơn hàng. Vui lòng đặt số lượng tồn kho về 0."
        )
    
    db.delete(book)
    db.commit()
    
    return None


@router.patch("/{book_id}/stock", response_model=BookResponseAdmin)
async def update_stock_admin(
    book_id: str,
    stock_quantity: int = Query(..., ge=0, description="Số lượng tồn kho mới"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Cập nhật nhanh số lượng tồn kho (Admin)"""
    
    stmt = select(Book).where(Book.book_id == book_id)
    result = db.execute(stmt)
    book = result.scalar_one_or_none()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy sách"
        )
    
    book.stock_quantity = stock_quantity
    db.commit()
    db.refresh(book)
    
    # Load lại với category
    stmt = select(Book).options(joinedload(Book.category)).where(Book.book_id == book_id)
    result = db.execute(stmt)
    book = result.scalar_one()
    
    return BookResponseAdmin.model_validate(book)