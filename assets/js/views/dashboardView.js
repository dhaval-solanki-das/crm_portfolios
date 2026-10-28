/**
 * NexaOps AI - Overview Dashboard View
 */

import { store } from '../data/store.js';

export class DashboardView {
  static render(container, onNavigate) {
    const metrics = store.getMetrics();
    const pos = store.getPurchaseOrders().slice(0, 5); // 5 most recent
    const insights = store.getOperationalInsights();
    const containers = store.getContainers().slice(0, 4);

    container.innerHTML = `
      <div class="dashboard-container">
        <!-- Top Metrics Cards -->
        <div class="metrics-grid">
          <div class="metric-card" data-target="purchase-orders">
            <div class="metric-header">
              <span class="metric-title">Total Purchase Orders</span>
              <div class="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
            </div>
            <div class="metric-value">${metrics.totalPurchaseOrders}</div>
            <div class="metric-footer">
              <span class="trend-up">↑ +12.4%</span>
              <span>vs last month</span>
            </div>
          </div>

          <div class="metric-card" data-target="purchase-orders" data-filter="pending">
            <div class="metric-header">
              <span class="metric-title">Pending Approvals</span>
              <div class="metric-icon-wrap" style="background: var(--color-warning-bg); color: var(--color-warning);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            </div>
            <div class="metric-value" style="color: var(--color-warning);">${metrics.pendingApprovals}</div>
            <div class="metric-footer">
              <span style="color: var(--color-warning); font-weight: 600;">Requires admin review</span>
            </div>
          </div>

          <div class="metric-card" data-target="vendors">
            <div class="metric-header">
              <span class="metric-title">Active Suppliers</span>
              <div class="metric-icon-wrap" style="background: var(--color-teal-light); color: var(--color-teal);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                </svg>
              </div>
            </div>
            <div class="metric-value">${metrics.activeVendors}</div>
            <div class="metric-footer">
              <span class="trend-up">★ 4.8</span>
              <span>Average supplier rating</span>
            </div>
          </div>

          <div class="metric-card" data-target="warehouses">
            <div class="metric-header">
              <span class="metric-title">Active Warehouses</span>
              <div class="metric-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
            </div>
            <div class="metric-value">${metrics.activeWarehouses}</div>
            <div class="metric-footer">
              <span class="trend-up">73.8%</span>
              <span>Average capacity utilization</span>
            </div>
          </div>

          <div class="metric-card" data-target="containers">
            <div class="metric-header">
              <span class="metric-title">Active Containers</span>
              <div class="metric-icon-wrap" style="background: var(--color-info-bg); color: var(--color-info);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
            </div>
            <div class="metric-value">${metrics.activeContainers}</div>
            <div class="metric-footer">
              <span class="trend-up">4 Arriving</span>
              <span>this week</span>
            </div>
          </div>

          <div class="metric-card" data-target="inventory">
            <div class="metric-header">
              <span class="metric-title">Inventory Items</span>
              <div class="metric-icon-wrap" style="background: #F1F5F9; color: var(--color-navy);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
            </div>
            <div class="metric-value">${metrics.inventoryItems.toLocaleString()}</div>
            <div class="metric-footer">
              <span style="color: var(--color-error); font-weight: 600;">2 SKUs</span>
              <span>below safety point</span>
            </div>
          </div>
        </div>

        <!-- AI Operational Insights Banner -->
        <div class="card" style="padding: 16px 20px; background: linear-gradient(135deg, #FAF5FF, #EFF6FF); border-color: #DDD6FE;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">✨</span>
              <h3 style="font-size: 14px; font-weight: 700; color: #5B21B6; text-transform: uppercase; letter-spacing: 0.5px;">
                Nexa AI — Operational Insights & Automated Alerts
              </h3>
            </div>
            <button class="btn btn-sm btn-outline" style="border-color: #8B5CF6; color: #6D28D9;" id="dash-ask-ai-btn">
              Ask Nexa AI
            </button>
          </div>

          <div class="insights-container">
            ${insights.map(item => `
              <div class="insight-card ${item.severity}">
                <div class="insight-icon">
                  ${item.severity === 'critical' ? '⚠️' : item.severity === 'warning' ? '⏳' : item.severity === 'success' ? '✓' : 'ℹ️'}
                </div>
                <div class="insight-content">
                  <div class="insight-title">${item.title}</div>
                  <div class="insight-desc">${item.message}</div>
                  <span class="insight-btn" data-target="${item.actionTarget}">
                    ${item.actionText} →
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Charts Grid (PO Trends & Order Status) -->
        <div class="charts-grid">
          <div class="chart-card">
            <div class="card-header" style="margin-bottom: 4px;">
              <div>
                <h3 class="card-title">Purchase Order Volume Trend (2026)</h3>
                <p class="card-subtitle">Monthly purchase order expenditure and volume cadence</p>
              </div>
              <span class="badge badge-success">+14.2% YoY Growth</span>
            </div>
            <div class="chart-svg-wrap">
              <svg class="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="poTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <!-- Grid Lines -->
                <line x1="40" y1="30" x2="580" y2="30" stroke="#E2E8F0" stroke-dasharray="3 3"/>
                <line x1="40" y1="80" x2="580" y2="80" stroke="#E2E8F0" stroke-dasharray="3 3"/>
                <line x1="40" y1="130" x2="580" y2="130" stroke="#E2E8F0" stroke-dasharray="3 3"/>
                <line x1="40" y1="180" x2="580" y2="180" stroke="#CBD5E1"/>

                <!-- Area Fill -->
                <polygon points="40,180 40,130 110,110 180,125 250,90 320,95 390,70 460,55 530,45 580,35 580,180" fill="url(#poTrendGrad)"/>

                <!-- Trend Line -->
                <polyline points="40,130 110,110 180,125 250,90 320,95 390,70 460,55 530,45 580,35" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

                <!-- Data Dots -->
                <circle cx="40" cy="130" r="4" fill="#2563EB"/>
                <circle cx="110" cy="110" r="4" fill="#2563EB"/>
                <circle cx="180" cy="125" r="4" fill="#2563EB"/>
                <circle cx="250" cy="90" r="4" fill="#2563EB"/>
                <circle cx="320" cy="95" r="4" fill="#2563EB"/>
                <circle cx="390" cy="70" r="4" fill="#2563EB"/>
                <circle cx="460" cy="55" r="4" fill="#2563EB"/>
                <circle cx="530" cy="45" r="4" fill="#2563EB"/>
                <circle cx="580" cy="35" r="5" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2"/>

                <!-- X Axis Labels -->
                <text x="40" y="196" font-size="10" fill="#64748B" text-anchor="middle">Feb</text>
                <text x="110" y="196" font-size="10" fill="#64748B" text-anchor="middle">Mar</text>
                <text x="180" y="196" font-size="10" fill="#64748B" text-anchor="middle">Apr</text>
                <text x="250" y="196" font-size="10" fill="#64748B" text-anchor="middle">May</text>
                <text x="320" y="196" font-size="10" fill="#64748B" text-anchor="middle">Jun</text>
                <text x="390" y="196" font-size="10" fill="#64748B" text-anchor="middle">Jul</text>
                <text x="460" y="196" font-size="10" fill="#64748B" text-anchor="middle">Aug</text>
                <text x="530" y="196" font-size="10" fill="#64748B" text-anchor="middle">Sep</text>
                <text x="580" y="196" font-size="10" fill="#2563EB" font-weight="bold" text-anchor="middle">Oct</text>
              </svg>
            </div>
          </div>

          <div class="chart-card">
            <div class="card-header" style="margin-bottom: 8px;">
              <div>
                <h3 class="card-title">Order Status Distribution</h3>
                <p class="card-subtitle">Active order breakdown</p>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
                  <span>Approved & Shipped</span>
                  <span>58%</span>
                </div>
                <div style="height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
                  <div style="width: 58%; height: 100%; background: #2563EB; border-radius: 4px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
                  <span>In Transit (Ocean / Rail)</span>
                  <span>24%</span>
                </div>
                <div style="height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
                  <div style="width: 24%; height: 100%; background: #0F766E; border-radius: 4px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
                  <span>Pending Administrative Review</span>
                  <span>12%</span>
                </div>
                <div style="height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
                  <div style="width: 12%; height: 100%; background: #D97706; border-radius: 4px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px;">
                  <span>Delivered & Stocked</span>
                  <span>6%</span>
                </div>
                <div style="height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
                  <div style="width: 6%; height: 100%; background: #16A34A; border-radius: 4px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent POs and Logistics Split -->
        <div class="ops-split-grid">
          <!-- Recent POs -->
          <div class="card" style="padding: 0; overflow: hidden;">
            <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <h3 class="card-title">Recent Purchase Orders</h3>
                <p class="card-subtitle">Active transactions in the demo database</p>
              </div>
              <button class="btn btn-sm btn-outline" id="dash-view-all-pos-btn">View All Orders</button>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Product / SKU</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${pos.map(p => `
                  <tr>
                    <td><a href="#po-${p.poNumber}" class="po-link" data-po="${p.poNumber}">${p.poNumber}</a></td>
                    <td><strong>${p.vendorName}</strong></td>
                    <td>${p.sku}</td>
                    <td><strong>$${p.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                    <td>
                      <span class="badge ${p.status === 'Approved' ? 'badge-success' : p.status === 'Pending Approval' ? 'badge-warning' : p.status === 'In Transit' ? 'badge-info' : 'badge-neutral'}">
                        <span class="badge-dot"></span>
                        ${p.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Active Shipping Containers Tracking -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Live Ocean & Rail Shipments</h3>
                <p class="card-subtitle">Port clearances and container ETAs</p>
              </div>
              <button class="btn btn-sm btn-outline" id="dash-view-all-containers-btn">All Containers</button>
            </div>
            <div class="activity-feed-list">
              ${containers.map(c => `
                <div class="activity-item">
                  <div class="activity-dot-line">
                    <div class="activity-dot"></div>
                    <div class="activity-line"></div>
                  </div>
                  <div class="activity-body">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span class="activity-title" style="font-family: var(--font-mono);">${c.id} (${c.carrier})</span>
                      <span class="badge badge-info">${c.logisticsStatus}</span>
                    </div>
                    <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">
                      ${c.originPort} → ${c.destinationPort}
                    </p>
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
                      <span>ETA: <strong>${c.expectedArrival}</strong></span>
                      <span>Progress: ${c.progressPct}%</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Handlers
    container.querySelectorAll('.metric-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.dataset.target;
        if (target && typeof onNavigate === 'function') {
          onNavigate(target);
        }
      });
    });

    container.querySelectorAll('.insight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target && typeof onNavigate === 'function') {
          onNavigate(target);
        }
      });
    });

    container.querySelector('#dash-ask-ai-btn')?.addEventListener('click', () => {
      if (typeof onNavigate === 'function') onNavigate('assistant');
    });

    container.querySelector('#dash-view-all-pos-btn')?.addEventListener('click', () => {
      if (typeof onNavigate === 'function') onNavigate('purchase-orders');
    });

    container.querySelector('#dash-view-all-containers-btn')?.addEventListener('click', () => {
      if (typeof onNavigate === 'function') onNavigate('containers');
    });

    container.querySelectorAll('.po-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const poNum = link.dataset.po;
        if (typeof onNavigate === 'function') {
          onNavigate('purchase-orders', { selectedPo: poNum });
        }
      });
    });
  }
}
