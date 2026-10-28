import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Numeric, Integer, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="operations", nullable=False)  # admin, operations, vendor, warehouse, logistics
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=True)
    warehouse_id = Column(String(36), ForeignKey("warehouses.id"), nullable=True)
    department = Column(String(120), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="users")
    warehouse = relationship("Warehouse", back_populates="users")


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_code = Column(String(50), unique=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(120), nullable=True)
    contact_person = Column(String(120))
    email = Column(String(255))
    phone = Column(String(50))
    country = Column(String(120))
    status = Column(String(50), default="Active")
    rating = Column(Numeric(3, 1), default=4.8)
    lead_time_days = Column(Integer, default=14)
    payment_terms = Column(String(120), default="Net 30")
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="vendor")
    purchase_orders = relationship("PurchaseOrder", back_populates="vendor")
    products = relationship("Product", back_populates="vendor")


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    warehouse_code = Column(String(50), unique=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    capacity_sqft = Column(Integer, default=50000)
    occupied_pct = Column(Integer, default=75)
    status = Column(String(50), default="Operational")
    manager_name = Column(String(120))
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="warehouse")
    purchase_orders = relationship("PurchaseOrder", back_populates="warehouse")
    products = relationship("Product", back_populates="warehouse")
    containers = relationship("ShippingContainer", back_populates="warehouse")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(120))
    unit_price = Column(Numeric(10, 2), nullable=False)
    available_qty = Column(Integer, default=0)
    reorder_threshold = Column(Integer, default=50)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=True)
    warehouse_id = Column(String(36), ForeignKey("warehouses.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="products")
    warehouse = relationship("Warehouse", back_populates="products")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    po_number = Column(String(50), unique=True, index=True, nullable=False)
    vendor_id = Column(String(36), ForeignKey("vendors.id"), nullable=False)
    warehouse_id = Column(String(36), ForeignKey("warehouses.id"), nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)
    expected_delivery_date = Column(DateTime, nullable=True)
    sku = Column(String(100), nullable=False)
    product_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    line_total = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="Pending Approval")  # Pending Approval, Approved, In Transit, Received, Cancelled
    approval_status = Column(String(100), default="Awaiting Admin Review")
    created_by = Column(String(120))
    created_role = Column(String(50), default="operations")
    container_id = Column(String(50), nullable=True)
    delay_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="purchase_orders")
    warehouse = relationship("Warehouse", back_populates="purchase_orders")


class ShippingContainer(Base):
    __tablename__ = "shipping_containers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    container_number = Column(String(50), unique=True, index=True, nullable=False)
    carrier = Column(String(120), nullable=False)
    vessel = Column(String(120))
    origin_port = Column(String(120))
    destination_port = Column(String(120))
    warehouse_id = Column(String(36), ForeignKey("warehouses.id"), nullable=False)
    logistics_status = Column(String(50), default="In Transit (Ocean)")
    departure_date = Column(DateTime, nullable=True)
    expected_arrival = Column(DateTime, nullable=True)
    progress_pct = Column(Integer, default=50)
    associated_vendor = Column(String(120))
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    warehouse = relationship("Warehouse", back_populates="containers")
