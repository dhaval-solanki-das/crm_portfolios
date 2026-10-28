from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])

@router.get("", response_model=List[schemas.PurchaseOrderOut])
def list_purchase_orders(
    status: Optional[str] = Query(None),
    role: Optional[str] = Query("admin"),
    vendor_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.PurchaseOrder)

    # Role-based scoping
    if role == "vendor" and vendor_id:
        query = query.filter(models.PurchaseOrder.vendor_id == vendor_id)

    if status and status.lower() != "all":
        if status.lower() == "pending":
            query = query.filter(models.PurchaseOrder.status == "Pending Approval")
        else:
            query = query.filter(models.PurchaseOrder.status.ilike(status))

    return query.order_by(models.PurchaseOrder.created_at.desc()).all()


@router.post("", response_model=schemas.PurchaseOrderOut)
def create_purchase_order(po_in: schemas.PurchaseOrderCreate, db: Session = Depends(get_db)):
    # Auto-generate next PO Number
    count = db.query(models.PurchaseOrder).count()
    po_number = f"PO-DEMO-{1001 + count}"

    line_total = round(po_in.quantity * po_in.unit_price, 2)

    db_po = models.PurchaseOrder(
        po_number=po_number,
        vendor_id=po_in.vendor_id,
        warehouse_id=po_in.warehouse_id,
        sku=po_in.sku,
        product_name=po_in.product_name,
        quantity=po_in.quantity,
        unit_price=po_in.unit_price,
        line_total=line_total,
        status="Pending Approval",
        approval_status="Awaiting Admin Review",
        created_by="Operations Demo User",
        created_role="operations",
        notes=po_in.notes
    )
    db.add(db_po)
    db.commit()
    db.refresh(db_po)
    return db_po


@router.post("/{po_number}/approve")
def approve_purchase_order(po_number: str, role: str = Query("admin"), db: Session = Depends(get_db)):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Permission Denied: Only Administrator role can approve purchase orders.")

    po = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.po_number == po_number).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    po.status = "Approved"
    po.approval_status = "Approved by Admin"
    db.commit()
    db.refresh(po)
    return {"success": True, "message": f"Purchase order {po_number} successfully approved."}


@router.post("/{po_number}/reject")
def reject_purchase_order(po_number: str, reason: str = Query("Rejected by executive review"), role: str = Query("admin"), db: Session = Depends(get_db)):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Permission Denied: Only Administrator role can reject purchase orders.")

    po = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.po_number == po_number).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    po.status = "Cancelled"
    po.approval_status = "Rejected by Admin"
    po.delay_reason = reason
    db.commit()
    db.refresh(po)
    return {"success": True, "message": f"Purchase order {po_number} rejected."}
