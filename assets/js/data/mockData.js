/**
 * NexaOps AI - Mock Data Layer
 * Interactive Portfolio Demo - All business data is fictional.
 * Zero confidential or live client information.
 */

export const DEMO_NOTICE = "Interactive Portfolio Demo — All business data is fictional.";

export const INITIAL_ROLES = {
  admin: {
    id: "user-admin-01",
    name: "Alexandra Wright",
    role: "admin",
    roleTitle: "Enterprise Administrator",
    avatar: "AW",
    email: "alexandra.wright@example.com",
    department: "Executive Operations",
    description: "Unrestricted access across all operational modules, approval workflows, user governance, and predictive analytics."
  },
  operations: {
    id: "user-ops-02",
    name: "Jordan Miller",
    role: "operations",
    roleTitle: "Operations & Procurement Lead",
    avatar: "JM",
    email: "jordan.miller@example.com",
    department: "Procurement & Supply Chain",
    description: "Prepares purchase orders, adjusts delivery timelines, monitors logistics, and collaborates with vendors."
  },
  vendor: {
    id: "user-vend-03",
    name: "Marcus Vance",
    role: "vendor",
    roleTitle: "Vendor Representative (Northstar Supply)",
    avatar: "MV",
    email: "m.vance@northstar.example.com",
    department: "Northstar Supply",
    vendorId: "VEND-001",
    description: "Scoped solely to Northstar Supply records. Can review assigned POs, track shipment milestones, and confirm quantities."
  },
  warehouse: {
    id: "user-wh-04",
    name: "Carlos Mendez",
    role: "warehouse",
    roleTitle: "Warehouse Manager (East Coast Hub)",
    avatar: "CM",
    email: "carlos.mendez@example.com",
    department: "East Coast Logistics Hub",
    warehouseId: "WH-001",
    description: "Monitors physical stock counts, marks incoming containers as received, and audits storage threshold allocations."
  },
  logistics: {
    id: "user-log-05",
    name: "Rachel Zhang",
    role: "logistics",
    roleTitle: "Global Freight Specialist",
    avatar: "RZ",
    email: "rachel.zhang@example.com",
    department: "Global Freight & Customs",
    description: "Tracks active ocean and rail containers, oversees port customs clearance, and logs carrier tracking updates."
  }
};

export const INITIAL_VENDORS = [
  {
    id: "VEND-001",
    name: "Northstar Supply",
    category: "Thermal Systems & Casings",
    contactPerson: "Marcus Vance",
    email: "m.vance@northstar.example.com",
    phone: "+1 (555) 234-8901",
    city: "Chicago",
    state: "IL",
    country: "United States",
    status: "Active",
    rating: 4.9,
    leadTimeDays: 12,
    paymentTerms: "Net 30",
    openOrdersCount: 2,
    totalSpent: 48920.00
  },
  {
    id: "VEND-002",
    name: "BluePeak Components",
    category: "Precision Optics & Sensors",
    contactPerson: "Elena Rostova",
    email: "e.rostova@bluepeak.example.com",
    phone: "+49 (30) 9018-234",
    city: "Berlin",
    state: "Berlin",
    country: "Germany",
    status: "Active",
    rating: 4.8,
    leadTimeDays: 18,
    paymentTerms: "Net 45",
    openOrdersCount: 1,
    totalSpent: 62450.00
  },
  {
    id: "VEND-003",
    name: "Apex Global Logistics",
    category: "Packaging & Cargo Fixtures",
    contactPerson: "David Chen",
    email: "d.chen@apexglobal.example.com",
    phone: "+65 6789 0123",
    city: "Singapore",
    state: "Singapore",
    country: "Singapore",
    status: "Active",
    rating: 4.7,
    leadTimeDays: 8,
    paymentTerms: "Net 30",
    openOrdersCount: 1,
    totalSpent: 28100.00
  },
  {
    id: "VEND-004",
    name: "Quantum Electronics",
    category: "IoT Gateways & Microcontrollers",
    contactPerson: "Sarah Jenkins",
    email: "s.jenkins@quantum.example.com",
    phone: "+1 (555) 456-7890",
    city: "San Jose",
    state: "CA",
    country: "United States",
    status: "Active",
    rating: 4.6,
    leadTimeDays: 21,
    paymentTerms: "Net 60",
    openOrdersCount: 1,
    totalSpent: 94500.00
  },
  {
    id: "VEND-005",
    name: "Horizon Materials",
    category: "Polymers & Structural Aluminum",
    contactPerson: "Roberto Gomez",
    email: "r.gomez@horizon.example.com",
    phone: "+52 55 1234 5678",
    city: "Monterrey",
    state: "NL",
    country: "Mexico",
    status: "Active",
    rating: 4.5,
    leadTimeDays: 14,
    paymentTerms: "Net 30",
    openOrdersCount: 0,
    totalSpent: 35800.00
  },
  {
    id: "VEND-006",
    name: "Pacific Rim Industrial",
    category: "Pneumatics & High-Pressure Valves",
    contactPerson: "Kenji Sato",
    email: "k.sato@pacificrim.example.com",
    phone: "+81 3 5555 0192",
    city: "Yokohama",
    state: "Kanagawa",
    country: "Japan",
    status: "Active",
    rating: 4.8,
    leadTimeDays: 16,
    paymentTerms: "Net 45",
    openOrdersCount: 1,
    totalSpent: 51200.00
  }
];

export const INITIAL_WAREHOUSES = [
  {
    id: "WH-001",
    name: "East Coast Logistics Hub",
    location: "Edison, New Jersey",
    address: "400 Raritan Center Pkwy, Edison, NJ 08837",
    capacitySqFt: 50000,
    occupiedPct: 82,
    inventoryCount: 486,
    activeContainers: 12,
    status: "Operational",
    manager: "Carlos Mendez",
    isDefault: true
  },
  {
    id: "WH-002",
    name: "Midwest Distribution Center",
    location: "Chicago, Illinois",
    address: "1200 S Pulaski Rd, Chicago, IL 60623",
    capacitySqFt: 75000,
    occupiedPct: 68,
    inventoryCount: 394,
    activeContainers: 8,
    status: "Operational",
    manager: "Lisa Kowalski",
    isDefault: false
  },
  {
    id: "WH-003",
    name: "West Coast Gateway",
    location: "Long Beach, California",
    address: "2100 Ocean Blvd, Long Beach, CA 90802",
    capacitySqFt: 100000,
    occupiedPct: 91,
    inventoryCount: 278,
    activeContainers: 14,
    status: "Near Capacity",
    manager: "Brian Chen",
    isDefault: false
  },
  {
    id: "WH-004",
    name: "Southern Fulfillment Hub",
    location: "Dallas, Texas",
    address: "3400 Express Way, Dallas, TX 75247",
    capacitySqFt: 45000,
    occupiedPct: 54,
    inventoryCount: 126,
    activeContainers: 5,
    status: "Operational",
    manager: "Tanya Morales",
    isDefault: false
  }
];

export const INITIAL_PRODUCTS = [
  {
    sku: "DEMO-101",
    name: "Enterprise Server Rack Mount 2U",
    category: "Hardware Enclosures",
    unitPrice: 420.00,
    availableQty: 180,
    reorderThreshold: 50,
    warehouseId: "WH-001",
    warehouseName: "East Coast Logistics Hub",
    vendorId: "VEND-001",
    vendorName: "Northstar Supply",
    status: "In Stock"
  },
  {
    sku: "DEMO-104",
    name: "High-Efficiency Dual-Fan Cooling Unit",
    category: "Thermal Systems",
    unitPrice: 24.50,
    availableQty: 42,
    reorderThreshold: 60,
    warehouseId: "WH-002",
    warehouseName: "Midwest Distribution Center",
    vendorId: "VEND-001",
    vendorName: "Northstar Supply",
    status: "Low Stock"
  },
  {
    sku: "DEMO-208",
    name: "Optical Sensor Assembly Rev-C",
    category: "Optics & Sensors",
    unitPrice: 42.00,
    availableQty: 290,
    reorderThreshold: 100,
    warehouseId: "WH-003",
    warehouseName: "West Coast Gateway",
    vendorId: "VEND-002",
    vendorName: "BluePeak Components",
    status: "In Stock"
  },
  {
    sku: "DEMO-310",
    name: "Industrial Power Inverter 5kW Pure Sine",
    category: "Power Electronics",
    unitPrice: 315.00,
    availableQty: 85,
    reorderThreshold: 30,
    warehouseId: "WH-001",
    warehouseName: "East Coast Logistics Hub",
    vendorId: "VEND-004",
    vendorName: "Quantum Electronics",
    status: "In Stock"
  },
  {
    sku: "DEMO-415",
    name: "Reinforced Cargo Pallet Unit (Heavy Duty)",
    category: "Logistics Fixtures",
    unitPrice: 18.75,
    availableQty: 520,
    reorderThreshold: 150,
    warehouseId: "WH-004",
    warehouseName: "Southern Fulfillment Hub",
    vendorId: "VEND-003",
    vendorName: "Apex Global Logistics",
    status: "In Stock"
  },
  {
    sku: "DEMO-522",
    name: "Smart IoT Gateway Controller (LTE/BLE)",
    category: "Telemetry & Edge",
    unitPrice: 89.50,
    availableQty: 14,
    reorderThreshold: 40,
    warehouseId: "WH-001",
    warehouseName: "East Coast Logistics Hub",
    vendorId: "VEND-004",
    vendorName: "Quantum Electronics",
    status: "Critical Stock"
  },
  {
    sku: "DEMO-630",
    name: "Ultra-Flex Armored Cabling (100m Roll)",
    category: "Industrial Wiring",
    unitPrice: 64.00,
    availableQty: 140,
    reorderThreshold: 50,
    warehouseId: "WH-002",
    warehouseName: "Midwest Distribution Center",
    vendorId: "VEND-005",
    vendorName: "Horizon Materials",
    status: "In Stock"
  },
  {
    sku: "DEMO-744",
    name: "Precision Micro-Pneumatic Actuator",
    category: "Robotics & Pneumatics",
    unitPrice: 128.00,
    availableQty: 64,
    reorderThreshold: 30,
    warehouseId: "WH-003",
    warehouseName: "West Coast Gateway",
    vendorId: "VEND-006",
    vendorName: "Pacific Rim Industrial",
    status: "In Stock"
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    poNumber: "PO-DEMO-1001",
    vendorId: "VEND-001",
    vendorName: "Northstar Supply",
    orderDate: "2026-10-24",
    expectedDeliveryDate: "2026-11-05",
    sku: "DEMO-104",
    productName: "High-Efficiency Dual-Fan Cooling Unit",
    quantity: 150,
    unitPrice: 24.50,
    lineTotal: 3675.00,
    currency: "USD",
    warehouseId: "WH-001",
    warehouseName: "East Coast Logistics Hub",
    status: "Pending Approval",
    approvalStatus: "Awaiting Admin Review",
    createdBy: "Alex Taylor",
    createdRole: "operations",
    notes: "Emergency replenishment for data center cooling retrofit schedule.",
    containerId: null,
    delayReason: null,
    history: [
      { date: "2026-10-24 10:15", user: "Alex Taylor", action: "PO draft drafted via Nexa AI assistant." },
      { date: "2026-10-24 10:18", user: "Jordan Miller", action: "Submitted for Executive Approval." }
    ]
  },
  {
    poNumber: "PO-DEMO-1002",
    vendorId: "VEND-002",
    vendorName: "BluePeak Components",
    orderDate: "2026-10-20",
    expectedDeliveryDate: "2026-11-08",
    sku: "DEMO-208",
    productName: "Optical Sensor Assembly Rev-C",
    quantity: 80,
    unitPrice: 42.00,
    lineTotal: 3360.00,
    currency: "USD",
    warehouseId: "WH-003",
    warehouseName: "West Coast Gateway",
    status: "Approved",
    approvalStatus: "Approved by Admin",
    createdBy: "Jordan Miller",
    createdRole: "operations",
    notes: "Automated replenishment trigger based on inventory safety threshold.",
    containerId: null,
    delayReason: null,
    history: [
      { date: "2026-10-20 14:22", user: "Jordan Miller", action: "PO created." },
      { date: "2026-10-20 16:05", user: "Alexandra Wright", action: "Approved PO-DEMO-1002." }
    ]
  },
  {
    poNumber: "PO-DEMO-1003",
    vendorId: "VEND-004",
    vendorName: "Quantum Electronics",
    orderDate: "2026-10-14",
    expectedDeliveryDate: "2026-11-02",
    sku: "DEMO-522",
    productName: "Smart IoT Gateway Controller (LTE/BLE)",
    quantity: 200,
    unitPrice: 89.50,
    lineTotal: 17900.00,
    currency: "USD",
    warehouseId: "WH-001",
    warehouseName: "East Coast Logistics Hub",
    status: "In Transit",
    approvalStatus: "Approved by Admin",
    createdBy: "Jordan Miller",
    createdRole: "operations",
    notes: "Allocated to ocean freight container CONT-US-8921.",
    containerId: "CONT-US-8921",
    delayReason: null,
    history: [
      { date: "2026-10-14 09:12", user: "Jordan Miller", action: "PO created." },
      { date: "2026-10-14 11:30", user: "Alexandra Wright", action: "Approved PO." },
      { date: "2026-10-18 15:00", user: "Rachel Zhang", action: "Consolidated into Ocean Container CONT-US-8921." }
    ]
  },
  {
    poNumber: "PO-DEMO-1004",
    vendorId: "VEND-005",
    vendorName: "Horizon Materials",
    orderDate: "2026-10-05",
    expectedDeliveryDate: "2026-10-24",
    sku: "DEMO-415",
    productName: "Reinforced Cargo Pallet Unit (Heavy Duty)",
    quantity: 300,
    unitPrice: 18.75,
    lineTotal: 5625.00,
    currency: "USD",
    warehouseId: "WH-002",
    warehouseName: "Midwest Distribution Center",
    status: "Received",
    approvalStatus: "Completed",
    createdBy: "Alex Taylor",
    createdRole: "operations",
    notes: "Inspected and received into Bay 4 at Midwest Center.",
    containerId: null,
    delayReason: null,
    history: [
      { date: "2026-10-05 11:00", user: "Alex Taylor", action: "Created PO." },
      { date: "2026-10-05 13:45", user: "Alexandra Wright", action: "Approved PO." },
      { date: "2026-10-24 14:10", user: "Carlos Mendez", action: "Marked received and stocked." }
    ]
  },
  {
    poNumber: "PO-DEMO-1005",
    vendorId: "VEND-006",
    vendorName: "Pacific Rim Industrial",
    orderDate: "2026-10-25",
    expectedDeliveryDate: "2026-11-12",
    sku: "DEMO-744",
    productName: "Precision Micro-Pneumatic Actuator",
    quantity: 50,
    unitPrice: 128.00,
    lineTotal: 6400.00,
    currency: "USD",
    warehouseId: "WH-003",
    warehouseName: "West Coast Gateway",
    status: "Pending Approval",
    approvalStatus: "Awaiting Admin Review",
    createdBy: "Jordan Miller",
    createdRole: "operations",
    notes: "New robotic assembly line components. Requires engineering validation.",
    containerId: null,
    delayReason: null,
    history: [
      { date: "2026-10-25 16:30", user: "Jordan Miller", action: "Submitted PO for executive approval." }
    ]
  },
  {
    poNumber: "PO-DEMO-1006",
    vendorId: "VEND-001",
    vendorName: "Northstar Supply",
    orderDate: "2026-10-22",
    expectedDeliveryDate: "2026-11-15",
    sku: "DEMO-101",
    productName: "Enterprise Server Rack Mount 2U",
    quantity: 40,
    unitPrice: 420.00,
    lineTotal: 16800.00,
    currency: "USD",
    warehouseId: "WH-001",
    warehouseName: "East Coast Logistics Hub",
    status: "Approved",
    approvalStatus: "Approved by Admin",
    createdBy: "Alex Taylor",
    createdRole: "operations",
    notes: "Standard monthly restocking.",
    containerId: null,
    delayReason: null,
    history: [
      { date: "2026-10-22 10:00", user: "Alex Taylor", action: "PO created." },
      { date: "2026-10-22 11:15", user: "Alexandra Wright", action: "Approved PO." }
    ]
  },
  {
    poNumber: "PO-DEMO-1007",
    vendorId: "VEND-003",
    vendorName: "Apex Global Logistics",
    orderDate: "2026-10-16",
    expectedDeliveryDate: "2026-11-04",
    sku: "DEMO-415",
    productName: "Reinforced Cargo Pallet Unit (Heavy Duty)",
    quantity: 100,
    unitPrice: 18.75,
    lineTotal: 1875.00,
    currency: "USD",
    warehouseId: "WH-004",
    warehouseName: "Southern Fulfillment Hub",
    status: "In Transit",
    approvalStatus: "Approved by Admin",
    createdBy: "Jordan Miller",
    createdRole: "operations",
    notes: "Shipped under container CONT-US-7742.",
    containerId: "CONT-US-7742",
    delayReason: null,
    history: [
      { date: "2026-10-16 08:45", user: "Jordan Miller", action: "PO created & auto-approved." },
      { date: "2026-10-19 14:00", user: "Rachel Zhang", action: "Assigned container CONT-US-7742." }
    ]
  },
  {
    poNumber: "PO-DEMO-1008",
    vendorId: "VEND-002",
    vendorName: "BluePeak Components",
    orderDate: "2026-10-18",
    expectedDeliveryDate: "2026-11-01",
    sku: "DEMO-208",
    productName: "Optical Sensor Assembly Rev-C",
    quantity: 120,
    unitPrice: 42.00,
    lineTotal: 5040.00,
    currency: "USD",
    warehouseId: "WH-003",
    warehouseName: "West Coast Gateway",
    status: "Cancelled",
    approvalStatus: "Rejected / Cancelled",
    createdBy: "Jordan Miller",
    createdRole: "operations",
    notes: "Duplicate order created by mistake. Cancelled by operations.",
    containerId: null,
    delayReason: "Duplicate batch entry corrected.",
    history: [
      { date: "2026-10-18 11:20", user: "Jordan Miller", action: "Created draft." },
      { date: "2026-10-18 11:40", user: "Alexandra Wright", action: "Cancelled duplicate order." }
    ]
  }
];

export const INITIAL_CONTAINERS = [
  {
    id: "CONT-US-8921",
    containerReference: "MSKU-982145-0",
    carrier: "Maersk Line",
    vessel: "Maersk Mc-Kinney Moller",
    originPort: "Shanghai Port (CNSHG)",
    destinationPort: "Port of Long Beach (USLGB)",
    destinationWarehouseId: "WH-003",
    destinationWarehouseName: "West Coast Gateway",
    linkedPoNumbers: ["PO-DEMO-1003"],
    logisticsStatus: "Customs Clearance",
    departureDate: "2026-10-12",
    expectedArrival: "2026-11-02",
    progressPct: 90,
    totalQtyInContainer: 200,
    inspected: true,
    associatedVendor: "Quantum Electronics",
    notes: "Cleared preliminary agricultural and customs documentation. Awaiting drayage pickup."
  },
  {
    id: "CONT-US-7742",
    containerReference: "HLXU-441209-3",
    carrier: "Hapag-Lloyd",
    vessel: "Al Jmeliyah",
    originPort: "Port of Rotterdam (NLRTM)",
    destinationPort: "Port of New York / New Jersey (USNYC)",
    destinationWarehouseId: "WH-001",
    destinationWarehouseName: "East Coast Logistics Hub",
    linkedPoNumbers: ["PO-DEMO-1007"],
    logisticsStatus: "In Transit (Ocean)",
    departureDate: "2026-10-18",
    expectedArrival: "2026-11-04",
    progressPct: 65,
    totalQtyInContainer: 100,
    inspected: false,
    associatedVendor: "Apex Global Logistics",
    notes: "Mid-Atlantic crossing on schedule. No maritime weather delays reported."
  },
  {
    id: "CONT-US-6210",
    containerReference: "EGLV-310892-7",
    carrier: "Evergreen Marine",
    vessel: "Ever Ace",
    originPort: "Busan Port (KRPUS)",
    destinationPort: "Port of Long Beach (USLGB)",
    destinationWarehouseId: "WH-003",
    destinationWarehouseName: "West Coast Gateway",
    linkedPoNumbers: ["PO-DEMO-1002"],
    logisticsStatus: "Docked / Unloading",
    departureDate: "2026-10-09",
    expectedArrival: "2026-10-29",
    progressPct: 98,
    totalQtyInContainer: 80,
    inspected: true,
    associatedVendor: "BluePeak Components",
    notes: "Berth assigned at Terminal Pier T. Unloading commenced 06:00."
  },
  {
    id: "CONT-US-9403",
    containerReference: "BNSF-772104-9",
    carrier: "BNSF Intermodal Rail",
    vessel: "Train #IL-CHI-88",
    originPort: "Long Beach Intermodal Railhead",
    destinationPort: "Chicago Rail Yard (Corwith)",
    destinationWarehouseId: "WH-002",
    destinationWarehouseName: "Midwest Distribution Center",
    linkedPoNumbers: ["PO-DEMO-1006"],
    logisticsStatus: "In Transit (Rail)",
    departureDate: "2026-10-24",
    expectedArrival: "2026-11-09",
    progressPct: 40,
    totalQtyInContainer: 40,
    inspected: true,
    associatedVendor: "Northstar Supply",
    notes: "Passed Kansas City junction on timetable schedule."
  }
];

export const INITIAL_OPERATIONAL_INSIGHTS = [
  {
    id: "INS-01",
    type: "inventory",
    severity: "critical",
    title: "Critical Stock Alert on IoT Gateways",
    message: "SKU DEMO-522 has 14 units available against a reorder threshold of 40. Lead time from Quantum Electronics is 21 days. PO-DEMO-1003 (200 units) arrives via CONT-US-8921 in 5 days.",
    actionText: "Track Container CONT-US-8921",
    actionTarget: "containers"
  },
  {
    id: "INS-02",
    type: "approvals",
    severity: "warning",
    title: "2 Purchase Orders Awaiting Admin Approval",
    message: "PO-DEMO-1001 ($3,675.00) and PO-DEMO-1005 ($6,400.00) require executive sign-off before vendor dispatch. Total pending commitment: $10,075.00.",
    actionText: "Review Pending Approvals",
    actionTarget: "purchase-orders"
  },
  {
    id: "INS-03",
    type: "logistics",
    severity: "info",
    title: "Container CONT-US-6210 Docked at Long Beach",
    message: "Ever Ace has docked at West Coast Gateway. Unloading 80 units of Optical Sensor Assembly (DEMO-208) for BluePeak Components. Expected warehouse intake in 24 hours.",
    actionText: "View Receiving Hub",
    actionTarget: "warehouses"
  },
  {
    id: "INS-04",
    type: "vendor",
    severity: "success",
    title: "Northstar Supply Maintained 99.1% On-Time SLA",
    message: "Average delivery variance for Northstar Supply decreased from +1.8 days to +0.2 days over the last 90 days. Top-rated supplier for Q3.",
    actionText: "Inspect Vendor Profile",
    actionTarget: "vendors"
  }
];

export const OCR_DEMO_SAMPLES = [
  {
    id: "doc-sample-1",
    type: "typed_po",
    title: "Typed Purchase Order Requisition",
    subtitle: "Northstar Supply Official Purchase Order",
    fileFormat: "PDF / PNG",
    filename: "PO_Requisition_Northstar_1001.pdf",
    confidenceOverall: 98.4,
    badge: "High Confidence",
    extractedFields: {
      poNumber: { value: "PO-DEMO-1001", confidence: 99.2, status: "verified" },
      vendorName: { value: "Northstar Supply", confidence: 98.9, status: "verified", matchedId: "VEND-001" },
      orderDate: { value: "2026-10-24", confidence: 97.5, status: "verified" },
      expectedDeliveryDate: { value: "2026-11-05", confidence: 96.0, status: "verified" },
      sku: { value: "DEMO-104", confidence: 99.1, status: "verified", matchedName: "High-Efficiency Dual-Fan Cooling Unit" },
      quantity: { value: 150, confidence: 98.0, status: "verified" },
      unitPrice: { value: 24.50, confidence: 98.5, status: "verified" },
      currency: { value: "USD", confidence: 99.5, status: "verified" },
      lineTotal: { value: 3675.00, confidence: 99.0, status: "verified" },
      destinationWarehouse: { value: "East Coast Logistics Hub", confidence: 95.8, status: "verified", matchedId: "WH-001" }
    },
    rawText: `NORTHSTAR SUPPLY INDUSTRIAL CORP.
PURCHASE ORDER REQUISITION #PO-DEMO-1001
Date: October 24, 2026
Deliver To: East Coast Logistics Hub, Edison, NJ 08837
Payment Terms: Net 30

Item Description: High-Efficiency Dual-Fan Cooling Unit
SKU: DEMO-104
Quantity: 150 Units
Unit Price: $24.50 USD
Subtotal: $3,675.00
Tax / Freight: Included
Total Amount Due: $3,675.00 USD
Authorized By: Alex Taylor (Operations)`
  },
  {
    id: "doc-sample-2",
    type: "scanned_bol",
    title: "Scanned Bill of Lading (Ocean Freight)",
    subtitle: "Apex Global Logistics Ocean Manifest",
    fileFormat: "JPG / Scan",
    filename: "Ocean_BOL_Apex_MSKU8921.jpg",
    confidenceOverall: 94.6,
    badge: "High Confidence",
    extractedFields: {
      poNumber: { value: "PO-DEMO-1003", confidence: 93.5, status: "verified" },
      vendorName: { value: "Quantum Electronics", confidence: 95.0, status: "verified", matchedId: "VEND-004" },
      carrier: { value: "Maersk Line", confidence: 96.2, status: "verified" },
      containerRef: { value: "MSKU-982145-0", confidence: 98.1, status: "verified" },
      originPort: { value: "Shanghai Port (CNSHG)", confidence: 92.4, status: "verified" },
      destinationPort: { value: "Port of Long Beach (USLGB)", confidence: 94.8, status: "verified" },
      sku: { value: "DEMO-522", confidence: 93.0, status: "verified", matchedName: "Smart IoT Gateway Controller" },
      quantity: { value: 200, confidence: 96.5, status: "verified" },
      weightKg: { value: "1,420 kg", confidence: 91.2, status: "info" }
    },
    rawText: `APEX GLOBAL LOGISTICS / OCEAN BILL OF LADING
Bill of Lading No: AGL-CNSHG-89210
Vessel / Voyage: Maersk Mc-Kinney Moller / V-410
Shipper: Quantum Electronics Export Hub, Shanghai
Consignee: NexaOps Fictional Operations Depot
Container Reference: MSKU-982145-0 (40ft High Cube)
Goods Description: 200 Units Smart IoT Gateway Controller [SKU: DEMO-522]
Attached PO: PO-DEMO-1003
Gross Weight: 1,420 KG | Customs Clearance: Preliminary Granted`
  },
  {
    id: "doc-sample-3",
    type: "handwritten",
    title: "Handwritten Maintenance Requisition",
    subtitle: "Field Engineer Urgent Restock Memo",
    fileFormat: "PNG / Handwriting",
    filename: "Field_Engineer_Requisition_Urgent.png",
    confidenceOverall: 88.7,
    badge: "Review Recommended",
    extractedFields: {
      poNumber: { value: "DRAFT-FIELD-109", confidence: 85.0, status: "needs_review" },
      vendorName: { value: "Northstar Supply", confidence: 91.4, status: "verified", matchedId: "VEND-001" },
      orderDate: { value: "2026-10-26", confidence: 88.0, status: "verified" },
      sku: { value: "DEMO-104", confidence: 89.2, status: "verified", matchedName: "High-Efficiency Dual-Fan Cooling Unit" },
      quantity: { value: 150, confidence: 87.5, status: "verified" },
      unitPrice: { value: 24.50, confidence: 86.0, status: "verified" },
      notes: { value: "Urgent cooling fans needed for Midwest server bay retrofit", confidence: 84.1, status: "info" }
    },
    rawText: `[HANDWRITTEN NOTE - OCR VISION EXTRACTION]
Date: Oct 26, 2026
URGENT FIELD REQUISITION
Need immediate order to Northstar Supply:
- 150 pieces of SKU: DEMO-104 (cooling units)
Standard price $24.50 per unit
Ship directly to Midwest Center.
Bay 3 temperatures running high.
Sign: Dan R. (Lead Technician)`
  },
  {
    id: "doc-sample-4",
    type: "vendor_quote",
    title: "Vendor Commercial Quotation",
    subtitle: "BluePeak Precision Optics Price Sheet",
    fileFormat: "XLSX / PDF",
    filename: "Quotation_BluePeak_Q4_Optics.xlsx",
    confidenceOverall: 96.8,
    badge: "High Confidence",
    extractedFields: {
      quotationNumber: { value: "QT-BP-2026-881", confidence: 97.4, status: "verified" },
      vendorName: { value: "BluePeak Components", confidence: 99.0, status: "verified", matchedId: "VEND-002" },
      sku: { value: "DEMO-208", confidence: 98.2, status: "verified", matchedName: "Optical Sensor Assembly Rev-C" },
      tierQuantity: { value: 80, confidence: 96.0, status: "verified" },
      quotedPrice: { value: 42.00, confidence: 98.8, status: "verified" },
      validUntil: { value: "2026-12-31", confidence: 94.5, status: "verified" },
      paymentTerms: { value: "Net 45 Days", confidence: 97.1, status: "verified" }
    },
    rawText: `BLUEPEAK COMPONENTS GMBH - COMMERCIAL QUOTATION
Quote Reference: QT-BP-2026-881
Issue Date: October 18, 2026 | Validity: December 31, 2026
Client: NexaOps Fictional Procurement Department

Item: Optical Sensor Assembly Rev-C (SKU DEMO-208)
Batch Tier: 50 - 200 units
Unit Price: $42.00 USD
Payment Terms: Net 45 Days
Lead Time: 18 Days Ex-Works Berlin`
  }
];
