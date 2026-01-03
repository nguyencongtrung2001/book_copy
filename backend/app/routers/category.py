from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services import category as category_service
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db

router = APIRouter(prefix="/categories", tags=["Categories"])



@router.get("/", response_model=List[CategoryResponse])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return category_service.get_all(db, skip, limit)



@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: str, db: Session = Depends(get_db)):
    category = category_service.get_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category



@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return category_service.create(db, category)



@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str, category_update: CategoryUpdate, db: Session = Depends(get_db)
):
    category = category_service.update(db, category_id, category_update)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category



@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: str, db: Session = Depends(get_db)):
    success = category_service.delete(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")