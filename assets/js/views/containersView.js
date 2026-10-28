/**
 * NexaOps AI - Containers & Logistics View
 */

import { store } from '../data/store.js';

export class ContainersView {
  static render(container, onNavigate) {
    const containers = store.getContainers();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Ocean Freight & Intermodal Logistics
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Track active shipping containers, port clearance milestones, and railhead transfers.
            </p>
          </div>
          <span class="badge badge-info">${containers.length} Active Shipments</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;">
          ${containers.map(c => `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span class="badge badge-neutral" style="font-family: var(--font-mono); font-size: 12px;">${c.id}</span>
                  <span class="badge ${c.logisticsStatus === 'Customs Clearance' ? 'badge-warning' : c.logisticsStatus === 'Docked / Unloading' ? 'badge-success' : 'badge-info'}">
                    ${c.logisticsStatus}
                  </span>
                </div>

                <h3 style="font-size: 16px; font-weight: 700; color: var(--color-navy);">${c.carrier}</h3>
                <p style="font-size: 12px; color: var(--color-text-secondary); font-family: var(--font-mono);">
                  Vessel: ${c.vessel} (Ref: ${c.containerReference})
                </p>

                <!-- Route -->
                <div style="margin-top: 14px; background: #F8FAFC; padding: 12px; border-radius: 8px; font-size: 12px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #64748B;">Origin:</span> <strong>${c.originPort}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748B;">Destination:</span> <strong>${c.destinationPort}</strong>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div style="margin-top: 14px;">
                  <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; margin-bottom: 4px;">
                    <span>Transit Progress</span>
                    <span>${c.progressPct}%</span>
                  </div>
                  <div style="height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${c.progressPct}%; height: 100%; background: #0F766E; border-radius: 3px;"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748B; margin-top: 4px;">
                    <span>Departed: ${c.departureDate}</span>
                    <span>ETA: <strong>${c.expectedArrival}</strong></span>
                  </div>
                </div>

                <div style="margin-top: 12px; font-size: 12px; color: var(--color-text-secondary); line-height: 1.4;">
                  ${c.notes}
                </div>
              </div>

              <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--color-border-subtle); display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 11px; color: var(--color-text-secondary);">
                  Linked PO: <strong style="font-family: var(--font-mono);">${c.linkedPoNumbers.join(', ')}</strong>
                </span>
                <button class="btn btn-sm btn-outline container-po-link" data-po="${c.linkedPoNumbers[0]}">
                  View PO →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.container-po-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const poNum = btn.dataset.po;
        if (typeof onNavigate === 'function') {
          onNavigate('purchase-orders', { selectedPo: poNum });
        }
      });
    });
  }
}
