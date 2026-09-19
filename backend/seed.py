from app.core.database import SessionLocal, engine, Base
from app.models.item import Product

Base.metadata.create_all(bind=engine)
db = SessionLocal()

initial_items = [
    {"product_name": "Tata Salt (Vacuum Evaporated)", "category": "Staples", "unit_quantity": "1 kg", "mrp_inr": 28.0, "stock_quantity": 25},
    {"product_name": "Aashirvaad Shudh Chakki Atta", "category": "Flour", "unit_quantity": "5 kg", "mrp_inr": 245.0, "stock_quantity": 12},
    {"product_name": "Maggi 2-Minute Masala Noodles", "category": "Snacks", "unit_quantity": "70g (Pack of 4)", "mrp_inr": 56.0, "stock_quantity": 40},
    {"product_name": "Fortune Sunlite Sunflower Oil", "category": "Cooking Oil", "unit_quantity": "1 Litre", "mrp_inr": 145.0, "stock_quantity": 18},
    {"product_name": "Parle-G Gold Glucose Biscuits", "category": "Biscuits & Cookies", "unit_quantity": "1 kg", "mrp_inr": 80.0, "stock_quantity": 30},
]

for item_data in initial_items:
    existing = db.query(Product).filter_by(product_name=item_data["product_name"]).first()
    if not existing:
        db.add(Product(**item_data))

db.commit()
db.close()
print("Seeded 5 initial Kirana products into SQLite database.")