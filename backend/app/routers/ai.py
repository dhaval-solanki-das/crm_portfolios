import uuid
import re
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.config import settings

router = APIRouter(prefix="/ai", tags=["Nexa AI Assistant"])

@router.post("/chat", response_model=schemas.AIChatResponse)
def chat_endpoint(
    req: schemas.AIChatRequest,
    role: str = Query("admin"),
    db: Session = Depends(get_db)
):
    conversation_id = req.conversation_id or str(uuid.uuid4())
    msg = req.message.strip()
    lower = msg.lower()

    # Role guardrail checks
    if role == "vendor" and ("all vendors" in lower or "competitor" in lower or "bluepeak" in lower):
        return schemas.AIChatResponse(
            conversation_id=conversation_id,
            message="**Access Restricted (RBAC Policy Enforcement)**\n\nAs a Vendor Representative, your data scope is restricted solely to your assigned supplier records.",
            status="error"
        )

    # 1. PO Creation Flow
    if "create" in lower and ("po" in lower or "order" in lower):
        qty = 150
        qty_match = re.search(r"(\d+)\s*(?:units?|pcs?|pieces?)?", msg, re.IGNORECASE)
        if qty_match:
            qty = int(qty_match.group(1))

        sku = "DEMO-104"
        sku_match = re.search(r"DEMO[- ]?(\d+)", msg, re.IGNORECASE)
        if sku_match:
            sku = f"DEMO-{sku_match.group(1)}"

        vendor = db.query(models.Vendor).first()
        vendor_name = vendor.name if vendor else "Northstar Supply"
        wh = db.query(models.Warehouse).first()
        wh_name = wh.name if wh else "East Coast Logistics Hub"

        price = 24.50
        total = round(qty * price, 2)

        return schemas.AIChatResponse(
            conversation_id=conversation_id,
            message=f"I have prepared a draft purchase order for **{qty} units** of **{sku}** from **{vendor_name}**.",
            status="pending_confirmation",
            actionCard={
                "type": "purchase_order_draft",
                "title": "Draft Purchase Order Preview",
                "vendor": vendor_name,
                "sku": sku,
                "quantity": qty,
                "unitPrice": f"${price:.2f}",
                "lineTotal": f"${total:,.2f} USD",
                "warehouse": wh_name,
                "status": "Awaiting User Confirmation"
            },
            quickReplies=["Yes, create it", "Cancel order"]
        )

    # 2. Pending Approvals Query
    if "pending" in lower or "approval" in lower:
        pending_pos = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.status == "Pending Approval").all()
        rows = [[p.po_number, p.vendor.name if p.vendor else "Northstar Supply", p.sku, str(p.quantity), f"${p.lineTotal:,.2f}", p.expected_delivery_date.strftime("%Y-%m-%d") if p.expected_delivery_date else "2026-11-05"] for p in pending_pos]
        return schemas.AIChatResponse(
            conversation_id=conversation_id,
            message=f"Found **{len(rows)} purchase order(s)** awaiting administrative review in the database:",
            status="success",
            table={
                "columns": ["PO Number", "Vendor", "SKU", "Quantity", "Total Amount", "Expected Delivery"],
                "rows": rows or [["PO-DEMO-1001", "Northstar Supply", "DEMO-104", "150", "$3,675.00", "2026-11-05"]]
            },
            quickReplies=["Explain why a purchase order is awaiting approval", "Overview Dashboard"]
        )

    # 3. Containers Query
    if "container" in lower or "arriving" in lower or "shipment" in lower:
        containers = db.query(models.ShippingContainer).all()
        rows = [[c.container_number, c.associated_vendor or "Quantum Electronics", c.carrier, f"{c.origin_port} → {c.destination_port}", c.logistics_status] for c in containers]
        return schemas.AIChatResponse(
            conversation_id=conversation_id,
            message=f"Found **{len(rows) or 4} active ocean and rail containers**:",
            status="success",
            table={
                "columns": ["Container #", "Vendor", "Carrier", "Route", "Status"],
                "rows": rows or [
                    ["MSKU-982145-0", "Quantum Electronics", "Maersk Line", "Shanghai → Long Beach", "Customs Clearance"],
                    ["HLXU-441209-3", "Apex Global Logistics", "Hapag-Lloyd", "Rotterdam → New York", "In Transit (Ocean)"]
                ]
            },
            quickReplies=["Show me pending purchase orders", "Check stock availability in the demo warehouse"]
        )

    # Default Assistant Response
    return schemas.AIChatResponse(
        conversation_id=conversation_id,
        message=f"I have processed your request: **'{msg}'** through the NexaOps multi-agent orchestrator. Let me know if you would like to inspect pending approvals, create a new PO draft, or audit warehouse stock.",
        status="success",
        quickReplies=["Show me pending purchase orders.", "Create a purchase order for 150 units of SKU DEMO-104.", "Find containers arriving this week."]
    )
