from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, init_db
from app.routers.user import router as user_router
from app.routers.book import router as book_router
from app.routers.book_admin import router as book_admin_router  # Import router admin

app = FastAPI(
    title="Book Shop API",
    description="API cho hệ thống quản lý nhà sách UTE",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # Thêm domain production nếu có
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    print("✅ Database tables created successfully!")
    print("🚀 Server is running on http://127.0.0.1:8000")
    print("📚 API Docs: http://127.0.0.1:8000/docs")

# Include routers
app.include_router(user_router, prefix="/api")
app.include_router(book_router, prefix="/api")
app.include_router(book_admin_router, prefix="/api")  # Thêm router admin


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Book Shop API is running!", 
        "status": "success",
        "docs": "/docs"
    }

@app.get("/test-db", tags=["Health"])
def test_db(db: Session = Depends(get_db)):
    """Test database connection"""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "✅ MySQL connected!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Book Shop API",
        "version": "1.0.0"
}   