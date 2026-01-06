
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.review import ReviewCreate, ReviewResponse, BookRatingSummary
from app.services import review as review_service

router = APIRouter(prefix="/reviews", tags=["Reviews"])


# Lấy danh sách đánh giá của sách
@router.get("/book/{book_id}", response_model=List[ReviewResponse])
def get_reviews(book_id: str, db: Session = Depends(get_db)):
    return review_service.get_book_reviews(db, book_id)


# Lấy điểm trung bình của sách
@router.get("/book/{book_id}/summary", response_model=BookRatingSummary)
def get_summary(book_id: str, db: Session = Depends(get_db)):
    return review_service.get_rating_summary(db, book_id)


# Gửi đánh giá mới
@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def post_review(data: ReviewCreate, db: Session = Depends(get_db)):
    return review_service.create_review(db, data)