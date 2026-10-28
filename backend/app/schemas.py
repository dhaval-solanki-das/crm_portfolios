from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class VendorOut(BaseModel):
    id: str
    vendor_code: Optional[str]
    name: str
    category: Optional[str]
    contact_person: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    country: Optional[str]
    status: str
    rating: float
    lead_time_days: int
    payment_terms: str

    class Config:
        from_attributes = True

class ProductOut(BaseModel):
    id: str
    sku: str
    name: str
    category: Optional[str]
    unit_price: float
    available_qty: int
    reorder_threshold: int
    vendor_id: Optional[str]
    warehouse_id: Optional[str]

    class Config:
        from_attributes = True

class PurchaseOrderCreate(BaseModel):
    vendor_id: str
    warehouse_id: str
    sku: str
    product_name: str
    quantity: int
    unit_price: float
    expected_delivery_date: Optional[str] = None
    notes: Optional[str] = None

class PurchaseOrderOut(BaseModel):
    id: str
    po_number: str
    vendor_id: str
    warehouse_id: str
    sku: str
    product_name: str
    quantity: int
    unit_price: float
    line_total: float
    currency: str
    status: str
    approval_status: str
    created_by: Optional[str]
    created_role: Optional[str]
    container_id: Optional[str]
    delay_reason: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ContainerOut(BaseModel):
    id: str
    container_number: str
    carrier: str
    vessel: Optional[str]
    origin_port: Optional[str]
    destination_port: Optional[str]
    logistics_status: str
    progress_pct: int
    associated_vendor: Optional[str]

    class Config:
        from_attributes = True

class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    conversation_id: Optional[str] = None

class AIChatResponse(BaseModel):
    conversation_id: str
    message: str
    status: str
    table: Optional[Any] = None
    actionCard: Optional[Any] = None
    quickReplies: Optional[List[str]] = None
