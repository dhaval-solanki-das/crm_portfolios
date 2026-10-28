from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models

router = APIRouter(prefix="/warehouses", tags=["Warehouses"])

@router.get("")
def list_warehouses(db: Session = Depends(get_db)):
    return db.query(models.Warehouse).all()
