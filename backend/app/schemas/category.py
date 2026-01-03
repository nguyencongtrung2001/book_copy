from typing import Optional
from pydantic import BaseModel

# Base
class CategoryBase(BaseModel):
    category_name: str


# Create
class CategoryCreate(CategoryBase):
    category_id: str


# Update
class CategoryUpdate(BaseModel):
    category_name: Optional[str] = None


# Response
class CategoryResponse(CategoryBase):
    category_id: str

    class Config:
        from_attributes = True