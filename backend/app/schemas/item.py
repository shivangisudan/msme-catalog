from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    product_name: str
    category: str
    unit_quantity: str
    mrp_inr: float
    stock_quantity: int

class ProductResponse(ProductCreate):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True