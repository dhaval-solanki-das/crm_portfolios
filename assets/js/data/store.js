/**
 * NexaOps AI - Reactive Data Store
 * Provides local-first state management, role-based data scoping,
 * and event emission for interactive portfolio demonstrations.
 */

import {
  INITIAL_ROLES,
  INITIAL_VENDORS,
  INITIAL_WAREHOUSES,
  INITIAL_PRODUCTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_CONTAINERS,
  INITIAL_OPERATIONAL_INSIGHTS,
  OCR_DEMO_SAMPLES
} from './mockData.js';

const STORAGE_KEYS = {
  CURRENT_ROLE: 'nexaops_current_role',
  PURCHASE_ORDERS: 'nexaops_purchase_orders',
  VENDORS: 'nexaops_vendors',
  WAREHOUSES: 'nexaops_warehouses',
  PRODUCTS: 'nexaops_products',
  CONTAINERS: 'nexaops_containers',
  INSIGHTS: 'nexaops_insights',
  NOTIFICATIONS: 'nexaops_notifications'
};

class Store {
  constructor() {
    this.subscribers = new Map();
    this.init();
  }

  init() {
    // Current active demo role (default: admin)
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    this.currentRoleKey = (savedRole && INITIAL_ROLES[savedRole]) ? savedRole : 'admin';

    // Purchase orders
    const savedPOs = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
    this.purchaseOrders = savedPOs ? JSON.parse(savedPOs) : [...INITIAL_PURCHASE_ORDERS];

    // Vendors
    const savedVendors = localStorage.getItem(STORAGE_KEYS.VENDORS);
    this.vendors = savedVendors ? JSON.parse(savedVendors) : [...INITIAL_VENDORS];

    // Warehouses
    const savedWarehouses = localStorage.getItem(STORAGE_KEYS.WAREHOUSES);
    this.warehouses = savedWarehouses ? JSON.parse(savedWarehouses) : [...INITIAL_WAREHOUSES];

    // Products / Inventory
    const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    this.products = savedProducts ? JSON.parse(savedProducts) : [...INITIAL_PRODUCTS];

    // Containers
    const savedContainers = localStorage.getItem(STORAGE_KEYS.CONTAINERS);
    this.containers = savedContainers ? JSON.parse(savedContainers) : [...INITIAL_CONTAINERS];

    // Operational insights
    const savedInsights = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
    this.insights = savedInsights ? JSON.parse(savedInsights) : [...INITIAL_OPERATIONAL_INSIGHTS];

    // System notifications
    this.notifications = [
      { id: 'notif-1', title: 'Container CONT-US-6210 Docked', time: '10 min ago', read: false, type: 'logistics' },
      { id: 'notif-2', title: 'PO-DEMO-1005 Submitted for Approval', time: '35 min ago', read: false, type: 'approval' },
      { id: 'notif-3', title: 'Inventory Safety Level: DEMO-522 Critical', time: '2 hours ago', read: true, type: 'inventory' }
    ];
  }

  // Event Subscription
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
    return () => {
      const list = this.subscribers.get(event) || [];
      this.subscribers.set(event, list.filter(cb => cb !== callback));
    };
  }

  notify(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => {
        try { cb(data); } catch (e) { console.error('Subscription error:', e); }
      });
    }
    // Global change event
    if (event !== 'change' && this.subscribers.has('change')) {
      this.subscribers.get('change').forEach(cb => {
        try { cb({ event, data }); } catch (e) { console.error('Global change error:', e); }
      });
    }
  }

  // Persistence Helper
  persist(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage unavailable or quota exceeded:', e);
    }
  }

  // -------------------------
  // Role & User Governance
  // -------------------------
  getCurrentRoleKey() {
    return this.currentRoleKey;
  }

  getCurrentUser() {
    return INITIAL_ROLES[this.currentRoleKey] || INITIAL_ROLES.admin;
  }

  setCurrentRole(roleKey) {
    if (!INITIAL_ROLES[roleKey]) {
      console.warn('Invalid role key:', roleKey);
      return;
    }
    this.currentRoleKey = roleKey;
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, roleKey);
    this.notify('role_changed', this.getCurrentUser());
  }

  getAllRoles() {
    return INITIAL_ROLES;
  }

  // -------------------------
  // Purchase Order Operations
  // -------------------------
  getPurchaseOrders(roleOverride = null) {
    const role = roleOverride || this.currentRoleKey;
    const user = INITIAL_ROLES[role];

    // Role-based scoping:
    // Vendor role only sees POs issued to their vendor
    if (role === 'vendor' && user.vendorId) {
      return this.purchaseOrders.filter(po => po.vendorId === user.vendorId);
    }
    // Warehouse role only sees POs for their warehouse
    if (role === 'warehouse' && user.warehouseId) {
      return this.purchaseOrders.filter(po => po.warehouseId === user.warehouseId);
    }

    // Admin and Operations see all purchase orders
    return [...this.purchaseOrders];
  }

  getPurchaseOrderByNumber(poNumber) {
    return this.purchaseOrders.find(po => po.poNumber.toUpperCase() === poNumber.toUpperCase()) || null;
  }

  createPurchaseOrder(poInput) {
    const user = this.getCurrentUser();
    
    // Auto-generate PO number
    const maxExisting = this.purchaseOrders.reduce((max, po) => {
      const match = po.poNumber.match(/PO-DEMO-(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 1008);
    const nextNumber = maxExisting + 1;
    const poNumber = `PO-DEMO-${nextNumber}`;

    const vendor = this.vendors.find(v => v.id === poInput.vendorId || v.name === poInput.vendorName) || {
      id: "VEND-001",
      name: poInput.vendorName || "Northstar Supply"
    };

    const warehouse = this.warehouses.find(w => w.id === poInput.warehouseId || w.name === poInput.warehouseName) || {
      id: "WH-001",
      name: poInput.warehouseName || "East Coast Logistics Hub"
    };

    const quantity = parseInt(poInput.quantity, 10) || 1;
    const unitPrice = parseFloat(poInput.unitPrice) || 0.0;
    const lineTotal = parseFloat((quantity * unitPrice).toFixed(2));

    const newPO = {
      poNumber,
      vendorId: vendor.id,
      vendorName: vendor.name,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: poInput.expectedDeliveryDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      sku: poInput.sku || "DEMO-104",
      productName: poInput.productName || "High-Efficiency Dual-Fan Cooling Unit",
      quantity,
      unitPrice,
      lineTotal,
      currency: "USD",
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      status: "Pending Approval",
      approvalStatus: "Awaiting Admin Review",
      createdBy: user.name,
      createdRole: user.role,
      notes: poInput.notes || "Created via NexaOps AI interactive interface.",
      containerId: null,
      delayReason: null,
      history: [
        {
          date: new Date().toLocaleString(),
          user: user.name,
          action: `Purchase order created via ${poInput.createdSource || 'NexaOps Assistant'}.`
        }
      ]
    };

    // Prepend to list
    this.purchaseOrders.unshift(newPO);
    this.persist(STORAGE_KEYS.PURCHASE_ORDERS, this.purchaseOrders);

    // Update vendor open orders count
    const vendorRecord = this.vendors.find(v => v.id === vendor.id);
    if (vendorRecord) {
      vendorRecord.openOrdersCount = (vendorRecord.openOrdersCount || 0) + 1;
      this.persist(STORAGE_KEYS.VENDORS, this.vendors);
    }

    // Add notification
    this.addNotification({
      title: `Draft ${poNumber} Created`,
      time: 'Just now',
      type: 'approval',
      read: false
    });

    this.notify('po_created', newPO);
    return newPO;
  }

  approvePurchaseOrder(poNumber) {
    const user = this.getCurrentUser();
    if (user.role !== 'admin') {
      return { success: false, message: "Permission Denied: Only Administrator role can approve purchase orders." };
    }

    const po = this.getPurchaseOrderByNumber(poNumber);
    if (!po) {
      return { success: false, message: `Purchase order ${poNumber} not found.` };
    }

    po.status = "Approved";
    po.approvalStatus = "Approved by Admin";
    po.history.push({
      date: new Date().toLocaleString(),
      user: user.name,
      action: `Order approved by ${user.name} (${user.roleTitle}).`
    });

    this.persist(STORAGE_KEYS.PURCHASE_ORDERS, this.purchaseOrders);
    this.notify('po_updated', po);
    return { success: true, po };
  }

  rejectPurchaseOrder(poNumber, reason = "Rejected during administrative review") {
    const user = this.getCurrentUser();
    if (user.role !== 'admin') {
      return { success: false, message: "Permission Denied: Only Administrator role can reject purchase orders." };
    }

    const po = this.getPurchaseOrderByNumber(poNumber);
    if (!po) {
      return { success: false, message: `Purchase order ${poNumber} not found.` };
    }

    po.status = "Cancelled";
    po.approvalStatus = "Rejected by Admin";
    po.delayReason = reason;
    po.history.push({
      date: new Date().toLocaleString(),
      user: user.name,
      action: `Order rejected: ${reason}`
    });

    this.persist(STORAGE_KEYS.PURCHASE_ORDERS, this.purchaseOrders);
    this.notify('po_updated', po);
    return { success: true, po };
  }

  updatePurchaseOrderStatus(poNumber, newStatus, notes = "") {
    const user = this.getCurrentUser();
    const po = this.getPurchaseOrderByNumber(poNumber);
    if (!po) {
      return { success: false, message: `Purchase order ${poNumber} not found.` };
    }

    po.status = newStatus;
    if (notes) po.notes = notes;
    po.history.push({
      date: new Date().toLocaleString(),
      user: user.name,
      action: `Status updated to ${newStatus}. ${notes}`
    });

    this.persist(STORAGE_KEYS.PURCHASE_ORDERS, this.purchaseOrders);
    this.notify('po_updated', po);
    return { success: true, po };
  }

  // -------------------------
  // Entities Access
  // -------------------------
  getVendors() {
    const user = this.getCurrentUser();
    if (user.role === 'vendor' && user.vendorId) {
      return this.vendors.filter(v => v.id === user.vendorId);
    }
    return [...this.vendors];
  }

  getWarehouses() {
    return [...this.warehouses];
  }

  getProducts() {
    const user = this.getCurrentUser();
    if (user.role === 'vendor' && user.vendorId) {
      return this.products.filter(p => p.vendorId === user.vendorId);
    }
    return [...this.products];
  }

  getContainers() {
    const user = this.getCurrentUser();
    if (user.role === 'vendor' && user.vendorId) {
      const vendorName = this.vendors.find(v => v.id === user.vendorId)?.name;
      return this.containers.filter(c => c.associatedVendor === vendorName);
    }
    if (user.role === 'warehouse' && user.warehouseId) {
      return this.containers.filter(c => c.destinationWarehouseId === user.warehouseId);
    }
    return [...this.containers];
  }

  getOperationalInsights() {
    return [...this.insights];
  }

  getNotifications() {
    return [...this.notifications];
  }

  addNotification(notif) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    this.notifications.unshift(newNotif);
    this.notify('notification_added', newNotif);
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => { n.read = true; });
    this.notify('notifications_read', this.notifications);
  }

  // -------------------------
  // Analytics Metrics
  // -------------------------
  getMetrics() {
    const pos = this.getPurchaseOrders();
    const pendingCount = pos.filter(p => p.status === 'Pending Approval').length;
    const totalPos = 248 + (pos.length - INITIAL_PURCHASE_ORDERS.length);
    const activeVendors = this.vendors.filter(v => v.status === 'Active').length;
    const activeWarehouses = this.warehouses.length;
    const activeContainers = 31;
    const inventoryItemsCount = 1284;

    const totalSpend = pos.reduce((sum, p) => sum + (p.status !== 'Cancelled' ? p.lineTotal : 0), 0);

    return {
      totalPurchaseOrders: totalPos,
      pendingApprovals: pendingCount,
      activeVendors,
      activeWarehouses,
      activeContainers,
      inventoryItems: inventoryItemsCount,
      totalSpend: 142850.00 + (totalSpend - 55600.00),
      onTimeDeliveryRate: 98.4
    };
  }

  // -------------------------
  // Demo Reset
  // -------------------------
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.PURCHASE_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.VENDORS);
    localStorage.removeItem(STORAGE_KEYS.WAREHOUSES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CONTAINERS);
    localStorage.removeItem(STORAGE_KEYS.INSIGHTS);
    this.init();
    this.notify('reset', null);
  }
}

export const store = new Store();
