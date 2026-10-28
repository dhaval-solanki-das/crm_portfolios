/**
 * NexaOps AI - Inventory & Products View
 */

import { store } from '../data/store.js';

export class InventoryView {
  static render(container, onNavigate) {
    const products = store.getProducts();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Products & Inventory Control
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Track real-time warehouse stock levels against safety reorder thresholds.
            </p>
          </div>
          <button class="btn btn-primary" id="inventory-ai-restock-btn">
            ✨ AI Replenishment Audit
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Description</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Available Qty</th>
                <th>Reorder Point</th>
                <th>Warehouse Hub</th>
                <th>Stock Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const isCritical = p.availableQty < p.reorderThreshold * 0.5;
                const isLow = p.availableQty <= p.reorderThreshold;
                return `
                  <tr>
                    <td><strong style="font-family: var(--font-mono); color: var(--color-navy);">${p.sku}</strong></td>
                    <td>
                      <strong>${p.name}</strong>
                      <span style="display: block; font-size: 11px; color: var(--color-text-secondary);">Supplier: ${p.vendorName}</span>
                    </td>
                    <td>${p.category}</td>
                    <td><strong>$${p.unitPrice.toFixed(2)}</strong></td>
                    <td style="font-size: 14px; font-weight: 700; color: ${isCritical ? 'var(--color-error)' : isLow ? 'var(--color-warning)' : 'var(--color-navy)'};">
                      ${p.availableQty} units
                    </td>
                    <td>${p.reorderThreshold} units</td>
                    <td>${p.warehouseName}</td>
                    <td>
                      <span class="badge ${isCritical ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}">
                        <span class="badge-dot"></span>
                        ${p.status}
                      </span>
                    </td>
                    <td>
                      ${isLow ? `
                        <button class="btn btn-sm btn-outline restock-po-btn" data-sku="${p.sku}" data-name="${p.name}" data-price="${p.unitPrice}" data-vendor="${p.vendorName}">
                          Restock PO
                        </button>
                      ` : `
                        <span style="font-size: 11px; color: var(--color-text-muted);">Sufficient</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.querySelector('#inventory-ai-restock-btn')?.addEventListener('click', () => {
      if (typeof onNavigate === 'function') {
        onNavigate('assistant', { prompt: "Summarize the latest inventory changes and identify items needing restock." });
      }
    });

    container.querySelectorAll('.restock-po-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sku = btn.dataset.sku;
        const vendor = btn.dataset.vendor;
        if (typeof onNavigate === 'function') {
          onNavigate('assistant', { prompt: `Create a purchase order for 150 units of SKU ${sku} from ${vendor}.` });
        }
      });
    });
  }
}
