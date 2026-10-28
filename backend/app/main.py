from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from app.config import settings
from app.database import engine, Base, SessionLocal
from app import models
from app.routers import purchase_orders, vendors, warehouses, containers, ai

# Initialize tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[NexaOps] Database table initialization notice: {e}")

# Pre-seed fictional demo data if database is fresh
def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(models.Vendor).count() == 0:
            print("[NexaOps] Pre-seeding fictional business data...")
            v1 = models.Vendor(id="VEND-001", vendor_code="VEND-001", name="Northstar Supply", category="Thermal Systems", contact_person="Marcus Vance", email="m.vance@example.com", phone="+1 (555) 234-8901", country="United States", rating=4.9, lead_time_days=12, payment_terms="Net 30")
            v2 = models.Vendor(id="VEND-002", vendor_code="VEND-002", name="BluePeak Components", category="Precision Optics", contact_person="Elena Rostova", email="e.rostova@example.com", phone="+49 (30) 9018-234", country="Germany", rating=4.8, lead_time_days=18, payment_terms="Net 45")
            db.add_all([v1, v2])

            wh1 = models.Warehouse(id="WH-001", warehouse_code="WH-001", name="East Coast Logistics Hub", location="Edison, New Jersey", capacity_sqft=50000, occupied_pct=82, manager_name="Carlos Mendez")
            wh2 = models.Warehouse(id="WH-002", warehouse_code="WH-002", name="Midwest Distribution Center", location="Chicago, Illinois", capacity_sqft=75000, occupied_pct=68, manager_name="Lisa Kowalski")
            db.add_all([wh1, wh2])

            p1 = models.Product(id="PROD-101", sku="DEMO-101", name="Enterprise Server Rack Mount 2U", category="Hardware Enclosures", unit_price=420.00, available_qty=180, reorder_threshold=50, vendor_id="VEND-001", warehouse_id="WH-001")
            p2 = models.Product(id="PROD-104", sku="DEMO-104", name="High-Efficiency Dual-Fan Cooling Unit", category="Thermal Systems", unit_price=24.50, available_qty=42, reorder_threshold=60, vendor_id="VEND-001", warehouse_id="WH-002")
            db.add_all([p1, p2])

            po1 = models.PurchaseOrder(
                po_number="PO-DEMO-1001",
                vendor_id="VEND-001",
                warehouse_id="WH-001",
                sku="DEMO-104",
                product_name="High-Efficiency Dual-Fan Cooling Unit",
                quantity=150,
                unit_price=24.50,
                line_total=3675.00,
                status="Pending Approval",
                approval_status="Awaiting Admin Review",
                created_by="Alex Taylor",
                notes="Emergency replenishment for data center cooling."
            )
            db.add(po1)

            c1 = models.ShippingContainer(
                container_number="MSKU-982145-0",
                carrier="Maersk Line",
                vessel="Maersk Mc-Kinney Moller",
                origin_port="Shanghai Port (CNSHG)",
                destination_port="Port of Long Beach (USLGB)",
                warehouse_id="WH-001",
                logistics_status="Customs Clearance",
                progress_pct=90,
                associated_vendor="Northstar Supply",
                notes="Cleared preliminary customs documentation."
            )
            db.add(c1)

            db.commit()
            print("[NexaOps] Seeding complete.")
    except Exception as e:
        print(f"[NexaOps] Data seeding notice: {e}")
        db.rollback()
    finally:
        db.close()

seed_demo_data()

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(purchase_orders.router, prefix="/api")
app.include_router(vendors.router, prefix="/api")
app.include_router(warehouses.router, prefix="/api")
app.include_router(containers.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mode": "Interactive Portfolio Demo",
        "notice": "All business records are fictional."
    }

# Mount static files if frontend exists in parent directory
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if os.path.exists(os.path.join(frontend_dir, "index.html")):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
