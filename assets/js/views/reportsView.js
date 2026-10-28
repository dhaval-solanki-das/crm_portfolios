/**
 * NexaOps AI - Reports & Analytics View
 */

import { store } from '../data/store.js';

export class ReportsView {
  static render(container, onNavigate) {
    const metrics = store.getMetrics();
    const vendors = store.getVendors();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Operational Intelligence & Executive Reports
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Aggregated procurement expenditure, vendor lead time variance, and supply chain SLA metrics.
            </p>
          </div>
          <button class="btn btn-secondary" onclick="window.print()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print Executive Summary
          </button>
        </div>

        <!-- 3 Performance Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div class="card">
            <span style="font-size: 12px; color: #64748B; font-weight: 600;">CUMULATIVE 90-DAY SPEND</span>
            <p style="font-size: 28px; font-weight: 800; color: var(--color-navy); margin-top: 6px;">
              $${metrics.totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </p>
            <span style="font-size: 11px; color: var(--color-success); font-weight: 600;">+8.3% budget efficiency</span>
          </div>

          <div class="card">
            <span style="font-size: 12px; color: #64748B; font-weight: 600;">ON-TIME FULFILLMENT SLA</span>
            <p style="font-size: 28px; font-weight: 800; color: var(--color-teal); margin-top: 6px;">
              ${metrics.onTimeDeliveryRate}%
            </p>
            <span style="font-size: 11px; color: var(--color-success); font-weight: 600;">Target SLA: 95.0%</span>
          </div>

          <div class="card">
            <span style="font-size: 12px; color: #64748B; font-weight: 600;">AVERAGE PO CYCLE TIME</span>
            <p style="font-size: 28px; font-weight: 800; color: var(--color-primary); margin-top: 6px;">
              1.4 Days
            </p>
            <span style="font-size: 11px; color: var(--color-primary); font-weight: 600;">Accelerated by Nexa AI</span>
          </div>
        </div>

        <!-- Vendor SLA Table -->
        <div class="table-container">
          <div class="table-header-bar">
            <h3 class="card-title">Supplier Performance Scorecard</h3>
            <span class="badge badge-info">Historical Signal Aggregation</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Historical Rating</th>
                <th>Contracted Lead Time</th>
                <th>Total Spend</th>
                <th>SLA Compliance</th>
              </tr>
            </thead>
            <tbody>
              ${vendors.map(v => `
                <tr>
                  <td><strong>${v.name}</strong></td>
                  <td>${v.category}</td>
                  <td><span class="badge badge-success">★ ${v.rating}</span></td>
                  <td>${v.leadTimeDays} Days</td>
                  <td><strong>$${v.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                  <td>
                    <span class="badge ${v.rating >= 4.7 ? 'badge-success' : 'badge-warning'}">
                      ${v.rating >= 4.7 ? 'Tier-1 Certified' : 'Acceptable'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
