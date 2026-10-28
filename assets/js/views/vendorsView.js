/**
 * NexaOps AI - Vendor Management View
 */

import { store } from '../data/store.js';

export class VendorsView {
  static render(container, onNavigate) {
    const vendors = store.getVendors();
    const pos = store.getPurchaseOrders();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Vendor & Supplier Management
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Maintain supplier SLAs, lead times, payment terms, and performance ratings.
            </p>
          </div>
          <span class="badge badge-info">${vendors.length} Verified Suppliers</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
          ${vendors.map(v => {
            const vendorPOs = pos.filter(p => p.vendorId === v.id);
            const openOrders = vendorPOs.filter(p => p.status !== 'Cancelled' && p.status !== 'Received').length;
            return `
              <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span class="badge badge-neutral" style="font-family: var(--font-mono);">${v.id}</span>
                    <span class="badge badge-success">★ ${v.rating} Score</span>
                  </div>
                  <h3 style="font-size: 17px; font-weight: 700; color: var(--color-navy);">${v.name}</h3>
                  <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">${v.category}</p>

                  <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; background: #F8FAFC; padding: 12px; border-radius: 8px;">
                    <div><span style="color: #64748B;">Contact:</span> <strong>${v.contactPerson}</strong></div>
                    <div><span style="color: #64748B;">Location:</span> <strong>${v.city}, ${v.country}</strong></div>
                    <div><span style="color: #64748B;">Lead Time:</span> <strong>${v.leadTimeDays} Days</strong></div>
                    <div><span style="color: #64748B;">Terms:</span> <strong>${v.paymentTerms}</strong></div>
                  </div>

                  <div style="margin-top: 10px; font-size: 11px; color: var(--color-text-muted);">
                    Email: <span style="font-family: var(--font-mono); color: var(--color-text-secondary);">${v.email}</span>
                  </div>
                </div>

                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--color-border-subtle); display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 12px; color: var(--color-text-secondary);">
                    <strong>${openOrders}</strong> open purchase order(s)
                  </span>
                  <button class="btn btn-sm btn-outline vendor-pos-btn" data-vendor="${v.name}">
                    View Orders →
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.vendor-pos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vendorName = btn.dataset.vendor;
        if (typeof onNavigate === 'function') {
          onNavigate('purchase-orders');
        }
      });
    });
  }
}
