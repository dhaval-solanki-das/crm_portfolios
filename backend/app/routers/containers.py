from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/containers", tags=["Containers & Logistics"])

@router.get("", response_model=List[schemas.ContainerOut])
def list_containers(db: Session = Depends(get_db)):
    return db.query(models.ShippingContainer).all()
