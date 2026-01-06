from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    book_id: str
    user_id: str


class ReviewResponse(ReviewBase):
    review_id: int
    book_id: str
    user_id: str
    user_fullname: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BookRatingSummary(BaseModel):
    average_rating: float
    total_reviews: int