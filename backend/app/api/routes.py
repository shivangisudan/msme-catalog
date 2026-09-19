from fastapi import APIRouter
from app.api.endpoints import catalog, process

api_router = APIRouter()
api_router.include_router(catalog.router, prefix="/catalog", tags=["Catalog"])
api_router.include_router(process.router, prefix="/catalog", tags=["Extraction"])