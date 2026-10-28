/**
 * NexaOps AI - Warehouse Management View
 */

import { store } from '../data/store.js';

export class WarehousesView {
  static render(container, onNavigate) {
    const warehouses = store.getWarehouses();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Warehouse & Fulfillment Hubs
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Storage capacity utilization, receiving dock status, and regional inventory distribution.
            </p>
          </div>
          <span class="badge badge-success">4 Strategic Regional Hubs</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
          ${warehouses.map(w => `
            <div class="card">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span class="badge badge-neutral" style="font-family: var(--font-mono);">${w.id}</span>
                <span class="badge ${w.occupiedPct > 85 ? 'badge-warning' : 'badge-success'}">${w.status}</span>
              </div>

              <h3 style="font-size: 17px; font-weight: 700; color: var(--color-navy);">${w.name}</h3>
              <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">📍 ${w.location}</p>

              <!-- Capacity Progress Bar -->
              <div style="margin-top: 16px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
                  <span>Storage Utilization</span>
                  <span style="color: ${w.occupiedPct > 85 ? 'var(--color-warning)' : 'var(--color-navy)'};">${w.occupiedPct}%</span>
                </div>
                <div style="height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
                  <div style="width: ${w.occupiedPct}%; height: 100%; background: ${w.occupiedPct > 85 ? '#D97706' : '#2563EB'}; border-radius: 4px;"></div>
                </div>
                <span style="font-size: 11px; color: var(--color-text-muted); display: block; margin-top: 4px;">
                  Total Capacity: ${w.capacitySqFt.toLocaleString()} sq ft
                </span>
              </div>

              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--color-border-subtle); display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div><span style="color: #64748B;">Items Stocked:</span> <strong>${w.inventoryCount} units</strong></div>
                <div><span style="color: #64748B;">Active Containers:</span> <strong>${w.activeContainers} inbound</strong></div>
                <div style="grid-column: span 2; color: #64748B;">Manager: <strong>${w.manager}</strong></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
