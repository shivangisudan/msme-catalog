from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.item import Product
from app.schemas.item import ProductCreate, ProductResponse

router = APIRouter()

@router.get("/items", response_model=List[ProductResponse])
def get_all_items(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.id.desc()).all()

@router.post("/items", response_model=ProductResponse)
def create_item(item: ProductCreate, db: Session = Depends(get_db)):
    db_item = Product(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item