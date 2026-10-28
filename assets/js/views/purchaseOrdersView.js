/**
 * NexaOps AI - Purchase Order Management View
 */

import { store } from '../data/store.js';
import { RBACService } from '../services/rbacService.js';

export class PurchaseOrdersView {
  static render(container, onNavigate, options = {}) {
    let currentFilter = (options && options.filter) || 'all';
    let currentSearch = '';
    let selectedPO = null;

    const renderTable = () => {
      let pos = store.getPurchaseOrders();

      // Apply Filter
      if (currentFilter !== 'all') {
        if (currentFilter === 'pending') {
          pos = pos.filter(p => p.status === 'Pending Approval');
        } else {
          pos = pos.filter(p => p.status.toLowerCase() === currentFilter.toLowerCase());
        }
      }

      // Apply Search
      if (currentSearch) {
        const q = currentSearch.toLowerCase();
        pos = pos.filter(p => 
          p.poNumber.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.productName.toLowerCase().includes(q)
        );
      }

      const tbody = container.querySelector('#po-table-tbody');
      const countEl = container.querySelector('#po-count-display');
      if (countEl) countEl.textContent = `${pos.length} order(s)`;

      if (!tbody) return;

      if (pos.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
              <div style="font-size: 24px; margin-bottom: 8px;">📋</div>
              <strong>No purchase orders match your criteria.</strong>
              <p style="font-size: 12px; margin-top: 4px;">Try clearing filters or creating a new order.</p>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = pos.map(p => `
        <tr>
          <td><a href="#po-${p.poNumber}" class="po-link" data-po="${p.poNumber}">${p.poNumber}</a></td>
          <td>
            <strong>${p.vendorName}</strong>
            <span style="display: block; font-size: 11px; color: var(--color-text-secondary);">${p.warehouseName}</span>
          </td>
          <td>
            <strong>${p.sku}</strong>
            <span style="display: block; font-size: 11px; color: var(--color-text-secondary);">${p.productName}</span>
          </td>
          <td>${p.quantity}</td>
          <td>$${p.unitPrice.toFixed(2)}</td>
          <td><strong>$${p.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
          <td>
            <span class="badge ${p.status === 'Approved' ? 'badge-success' : p.status === 'Pending Approval' ? 'badge-warning' : p.status === 'In Transit' ? 'badge-info' : 'badge-neutral'}">
              <span class="badge-dot"></span>
              ${p.status}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-secondary po-view-detail-btn" data-po="${p.poNumber}">
              Details
            </button>
          </td>
        </tr>
      `).join('');

      // Detail links
      tbody.querySelectorAll('.po-link, .po-view-detail-btn').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const poNum = el.dataset.po;
          openDetailDrawer(poNum);
        });
      });
    };

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Header Actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Purchase Order Management
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Review procurement records, approve orders, and track supplier fulfilment.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-secondary" id="po-export-csv-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
            <button class="btn btn-primary" id="po-create-modal-trigger">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Purchase Order
            </button>
          </div>
        </div>

        <!-- Table Card -->
        <div class="table-container">
          <div class="table-header-bar">
            <div class="table-filters">
              <input type="text" class="table-search-input" id="po-search-input" placeholder="Search PO #, vendor, SKU..." />
              <select class="filter-select" id="po-status-filter">
                <option value="all">All Statuses</option>
                <option value="pending">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="In Transit">In Transit</option>
                <option value="Received">Received</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div style="font-size: 12px; color: var(--color-text-secondary);" id="po-count-display">
              Loading...
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Vendor / Destination</th>
                <th>Item / SKU</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Line Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="po-table-tbody"></tbody>
          </table>
        </div>
      </div>

      <!-- Create PO Modal -->
      <div class="modal-overlay" id="create-po-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Create Purchase Order</h3>
            <button class="modal-close-btn" id="create-po-close">✕</button>
          </div>
          <form id="create-po-form">
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Vendor / Supplier *</label>
                  <select class="form-control" id="form-vendor-select" required>
                    ${store.getVendors().map(v => `<option value="${v.id}">${v.name} (${v.paymentTerms})</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Destination Warehouse *</label>
                  <select class="form-control" id="form-warehouse-select" required>
                    ${store.getWarehouses().map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Product Item / SKU *</label>
                <select class="form-control" id="form-sku-select" required>
                  ${store.getProducts().map(p => `
                    <option value="${p.sku}" data-price="${p.unitPrice}" data-name="${p.name}">
                      ${p.sku} — ${p.name} ($${p.unitPrice.toFixed(2)})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Order Quantity (Units) *</label>
                  <input type="number" class="form-control" id="form-quantity" value="100" min="1" max="10000" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Unit Price (USD) *</label>
                  <input type="number" step="0.01" class="form-control" id="form-unit-price" value="24.50" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Expected Delivery Date</label>
                  <input type="date" class="form-control" id="form-delivery-date" value="${new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]}" />
                </div>
                <div class="form-group">
                  <label class="form-label">Calculated Total</label>
                  <input type="text" class="form-control" id="form-total-calc" value="$2,450.00 USD" readonly style="background: #F1F5F9; font-weight: 700; color: var(--color-primary);" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Procurement Notes / Justification</label>
                <textarea class="form-control" id="form-notes" rows="2" placeholder="e.g. Replenishment for safety threshold"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="create-po-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Purchase Order</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Detail Slide-Over Drawer -->
      <div class="drawer-overlay" id="po-detail-overlay">
        <div class="drawer-container" id="po-detail-drawer">
          <div class="drawer-header">
            <div>
              <span style="font-size: 11px; color: var(--color-text-secondary); font-family: var(--font-mono);">PO DETAILS</span>
              <h3 id="drawer-po-number" style="font-size: 18px; font-weight: 800; color: var(--color-navy);">PO-DEMO-XXXX</h3>
            </div>
            <button class="modal-close-btn" id="drawer-close-btn">✕</button>
          </div>
          <div class="drawer-body" id="drawer-body-content">
            <!-- Populated dynamically -->
          </div>
          <div class="drawer-footer" id="drawer-footer-actions">
            <!-- Action buttons (Approve, Reject, Print) -->
          </div>
        </div>
      </div>

      <!-- Printable Purchase Order View (Hidden except in Print) -->
      <div id="printable-po-view" style="display: none;"></div>
    `;

    // Calculation update
    const updateCalculatedTotal = () => {
      const qty = parseInt(container.querySelector('#form-quantity').value, 10) || 0;
      const price = parseFloat(container.querySelector('#form-unit-price').value) || 0;
      const total = qty * price;
      const totalInput = container.querySelector('#form-total-calc');
      if (totalInput) totalInput.value = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;
    };

    container.querySelector('#form-sku-select')?.addEventListener('change', (e) => {
      const selected = e.target.selectedOptions[0];
      const price = selected?.dataset.price;
      if (price) {
        container.querySelector('#form-unit-price').value = price;
        updateCalculatedTotal();
      }
    });

    container.querySelector('#form-quantity')?.addEventListener('input', updateCalculatedTotal);
    container.querySelector('#form-unit-price')?.addEventListener('input', updateCalculatedTotal);

    // Detail Drawer Handler
    const openDetailDrawer = (poNumber) => {
      const po = store.getPurchaseOrderByNumber(poNumber);
      if (!po) return;
      selectedPO = po;

      const overlay = container.querySelector('#po-detail-overlay');
      const drawerPoNum = container.querySelector('#drawer-po-number');
      const drawerBody = container.querySelector('#drawer-body-content');
      const drawerFooter = container.querySelector('#drawer-footer-actions');

      drawerPoNum.textContent = po.poNumber;

      drawerBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Status Banner -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
            <div>
              <span style="font-size: 11px; color: var(--color-text-secondary); text-transform: uppercase;">STATUS</span>
              <p style="font-weight: 700; color: var(--color-navy); font-size: 14px;">${po.status}</p>
            </div>
            <span class="badge ${po.status === 'Approved' ? 'badge-success' : po.status === 'Pending Approval' ? 'badge-warning' : 'badge-neutral'}">
              ${po.approvalStatus}
            </span>
          </div>

          <!-- Commercial Breakdown Card -->
          <div class="card" style="padding: 16px;">
            <h4 style="font-size: 13px; font-weight: 700; color: var(--color-navy); margin-bottom: 10px;">Order Details</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
              <div><span style="color: var(--color-text-secondary);">Supplier:</span> <strong>${po.vendorName}</strong></div>
              <div><span style="color: var(--color-text-secondary);">Destination Hub:</span> <strong>${po.warehouseName}</strong></div>
              <div><span style="color: var(--color-text-secondary);">SKU Item:</span> <strong>${po.sku}</strong></div>
              <div><span style="color: var(--color-text-secondary);">Quantity:</span> <strong>${po.quantity} units</strong></div>
              <div><span style="color: var(--color-text-secondary);">Unit Price:</span> <strong>$${po.unitPrice.toFixed(2)}</strong></div>
              <div><span style="color: var(--color-text-secondary);">Line Total:</span> <strong style="color: var(--color-primary); font-size: 13px;">$${po.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong></div>
              <div><span style="color: var(--color-text-secondary);">Order Date:</span> <strong>${po.orderDate}</strong></div>
              <div><span style="color: var(--color-text-secondary);">Expected:</span> <strong>${po.expectedDeliveryDate}</strong></div>
            </div>
            ${po.containerId ? `<div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #E2E8F0; font-size: 12px;"><span style="color: var(--color-text-secondary);">Assigned Freight Container:</span> <strong style="font-family: var(--font-mono); color: var(--color-teal);">${po.containerId}</strong></div>` : ''}
          </div>

          <!-- Notes -->
          <div style="font-size: 12px; background: #FFFBEB; border: 1px solid #FDE68A; padding: 12px; border-radius: var(--radius-md);">
            <strong style="color: #92400E;">Procurement Notes:</strong>
            <p style="color: #78350F; margin-top: 2px;">${po.notes || 'No special instructions recorded.'}</p>
          </div>

          <!-- Audit Timeline -->
          <div>
            <h4 style="font-size: 13px; font-weight: 700; color: var(--color-navy); margin-bottom: 8px;">Audit Trail</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${po.history.map(h => `
                <div style="font-size: 12px; padding: 8px 12px; background: #F8FAFC; border-radius: 6px; border-left: 3px solid var(--color-primary);">
                  <div style="display: flex; justify-content: space-between; color: var(--color-text-secondary); font-size: 11px;">
                    <span>${h.user}</span>
                    <span>${h.date}</span>
                  </div>
                  <p style="color: var(--color-text-primary); margin-top: 2px;">${h.action}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Footer Action Buttons
      const isAdmin = RBACService.can('canApprovePO');
      drawerFooter.innerHTML = `
        <button class="btn btn-secondary" id="drawer-print-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print PO
        </button>
        ${po.status === 'Pending Approval' ? `
          <button class="btn btn-danger" id="drawer-reject-btn">Reject Order</button>
          <button class="btn btn-success" id="drawer-approve-btn">Approve Order</button>
        ` : ''}
      `;

      overlay.classList.add('active');

      // Drawer Actions
      drawerFooter.querySelector('#drawer-print-btn')?.addEventListener('click', () => {
        printPurchaseOrder(po);
      });

      drawerFooter.querySelector('#drawer-approve-btn')?.addEventListener('click', () => {
        const res = store.approvePurchaseOrder(po.poNumber);
        if (res.success) {
          overlay.classList.remove('active');
          renderTable();
        } else {
          alert(res.message);
        }
      });

      drawerFooter.querySelector('#drawer-reject-btn')?.addEventListener('click', () => {
        const reason = prompt("Enter reason for rejection:", "Pricing renegotiation required");
        if (reason) {
          const res = store.rejectPurchaseOrder(po.poNumber, reason);
          if (res.success) {
            overlay.classList.remove('active');
            renderTable();
          } else {
            alert(res.message);
          }
        }
      });
    };

    // Close Drawer
    container.querySelector('#drawer-close-btn')?.addEventListener('click', () => {
      container.querySelector('#po-detail-overlay').classList.remove('active');
    });

    // Create Modal Triggers
    const modal = container.querySelector('#create-po-modal');
    container.querySelector('#po-create-modal-trigger')?.addEventListener('click', () => {
      if (!RBACService.can('canCreatePO')) {
        alert(RBACService.explainRefusal('create_po'));
        return;
      }
      modal.classList.add('active');
    });

    container.querySelector('#create-po-close')?.addEventListener('click', () => modal.classList.remove('active'));
    container.querySelector('#create-po-cancel')?.addEventListener('click', () => modal.classList.remove('active'));

    // Create Form Submit
    container.querySelector('#create-po-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const vendorSelect = container.querySelector('#form-vendor-select');
      const warehouseSelect = container.querySelector('#form-warehouse-select');
      const skuSelect = container.querySelector('#form-sku-select');
      const qty = parseInt(container.querySelector('#form-quantity').value, 10);
      const price = parseFloat(container.querySelector('#form-unit-price').value);
      const deliveryDate = container.querySelector('#form-delivery-date').value;
      const notes = container.querySelector('#form-notes').value;

      const newPO = store.createPurchaseOrder({
        vendorId: vendorSelect.value,
        vendorName: vendorSelect.selectedOptions[0].text.split(' (')[0],
        warehouseId: warehouseSelect.value,
        warehouseName: warehouseSelect.selectedOptions[0].text,
        sku: skuSelect.value,
        productName: skuSelect.selectedOptions[0].dataset.name,
        quantity: qty,
        unitPrice: price,
        expectedDeliveryDate: deliveryDate,
        notes,
        createdSource: 'Procurement Console'
      });

      modal.classList.remove('active');
      renderTable();
      openDetailDrawer(newPO.poNumber);
    });

    // Filters and Search
    container.querySelector('#po-search-input')?.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim();
      renderTable();
    });

    container.querySelector('#po-status-filter')?.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderTable();
    });

    // CSV Export
    container.querySelector('#po-export-csv-btn')?.addEventListener('click', () => {
      const pos = store.getPurchaseOrders();
      let csv = "PO Number,Vendor,SKU,Product Name,Quantity,Unit Price,Line Total,Currency,Warehouse,Status,Order Date,Expected Delivery\n";
      pos.forEach(p => {
        csv += `"${p.poNumber}","${p.vendorName}","${p.sku}","${p.productName}",${p.quantity},${p.unitPrice},${p.lineTotal},"${p.currency}","${p.warehouseName}","${p.status}","${p.orderDate}","${p.expectedDeliveryDate}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexaops_purchase_orders_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    // Printable Purchase Order
    const printPurchaseOrder = (po) => {
      const printDiv = container.querySelector('#printable-po-view');
      printDiv.innerHTML = `
        <div style="font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #000;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <div>
              <h1 style="font-size: 24px; font-weight: bold; margin: 0;">NexaOps AI</h1>
              <p style="margin: 4px 0 0 0; color: #555;">Commercial Operations & Logistics Platform</p>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 20px; margin: 0; color: #2563EB;">PURCHASE ORDER</h2>
              <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 16px;"><strong>${po.poNumber}</strong></p>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin: 30px 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold; color: #555; text-transform: uppercase;">VENDOR / SUPPLIER</p>
              <h3 style="margin: 4px 0 0 0; font-size: 16px;">${po.vendorName}</h3>
              <p style="margin: 2px 0 0 0;">Authorized Commercial Partner</p>
            </div>
            <div>
              <p style="font-size: 12px; font-weight: bold; color: #555; text-transform: uppercase;">SHIP TO / DESTINATION</p>
              <h3 style="margin: 4px 0 0 0; font-size: 16px;">${po.warehouseName}</h3>
              <p style="margin: 2px 0 0 0;">Receiving Department</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 2px 0;"><strong>Date:</strong> ${po.orderDate}</p>
              <p style="margin: 2px 0;"><strong>Expected Delivery:</strong> ${po.expectedDeliveryDate}</p>
              <p style="margin: 2px 0;"><strong>Status:</strong> ${po.status}</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background: #F1F5F9; border-bottom: 1px solid #CCC;">
                <th style="padding: 10px; text-align: left;">SKU</th>
                <th style="padding: 10px; text-align: left;">Description</th>
                <th style="padding: 10px; text-align: right;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Unit Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #EEE;">
                <td style="padding: 12px 10px; font-family: monospace;">${po.sku}</td>
                <td style="padding: 12px 10px;">${po.productName}</td>
                <td style="padding: 12px 10px; text-align: right;">${po.quantity}</td>
                <td style="padding: 12px 10px; text-align: right;">$${po.unitPrice.toFixed(2)}</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: bold;">$${po.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="padding: 16px 10px; text-align: right; font-weight: bold; font-size: 15px;">Total Commitment (${po.currency}):</td>
                <td style="padding: 16px 10px; text-align: right; font-weight: bold; font-size: 16px; color: #2563EB;">$${po.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 40px; border-top: 1px dashed #CCC; padding-top: 20px; font-size: 12px; color: #555;">
            <p><strong>Notice:</strong> This is a generated purchase order from the NexaOps AI interactive demonstration platform. All business data is fictional.</p>
          </div>
        </div>
      `;
      printDiv.style.display = 'block';
      window.print();
      printDiv.style.display = 'none';
    };

    // If options had a selectedPo
    renderTable();
    if (options && options.selectedPo) {
      openDetailDrawer(options.selectedPo);
    }
  }
}
