/**
 * NexaOps AI - User Management & RBAC Matrix View
 */

import { store } from '../data/store.js';
import { RBACService, PERMISSION_MATRIX } from '../services/rbacService.js';

export class UsersView {
  static render(container, onNavigate) {
    const roles = store.getAllRoles();
    const currentRoleKey = store.getCurrentRoleKey();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy); letter-spacing: -0.4px;">
              Role-Based Access Control (RBAC) Governance
            </h2>
            <p style="font-size: 13px; color: var(--color-text-secondary);">
              Demonstrating enterprise role separation, tenant scoping, and executive authorization boundaries.
            </p>
          </div>
          <div style="background: #FEF3C7; border: 1px solid #FDE68A; padding: 6px 14px; border-radius: var(--radius-full); font-size: 12px; color: #92400E; font-weight: 600;">
            ⚠️ Demo Switcher — Instant Persona Simulation
          </div>
        </div>

        <!-- Role Persona Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          ${Object.entries(roles).map(([key, u]) => `
            <div class="card ${key === currentRoleKey ? 'active-role-card' : ''}" style="${key === currentRoleKey ? 'border: 2px solid var(--color-primary); background: #FAFDFB;' : ''}">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div class="user-avatar" style="background: ${key === currentRoleKey ? 'var(--color-primary)' : 'var(--color-card-subtle)'}; color: ${key === currentRoleKey ? '#FFF' : 'var(--color-navy)'};">
                  ${u.avatar}
                </div>
                ${key === currentRoleKey ? '<span class="badge badge-success">Active Persona</span>' : ''}
              </div>
              <h4 style="font-size: 15px; font-weight: 700; color: var(--color-navy);">${u.name}</h4>
              <p style="font-size: 12px; font-weight: 600; color: var(--color-primary);">${u.roleTitle}</p>
              <p style="font-size: 11px; color: var(--color-text-secondary); margin-top: 6px; line-height: 1.4;">
                ${u.description}
              </p>
              <button class="btn btn-sm ${key === currentRoleKey ? 'btn-primary' : 'btn-secondary'} switch-role-btn" data-role="${key}" style="width: 100%; margin-top: 12px;">
                ${key === currentRoleKey ? 'Current Session' : 'Simulate Role'}
              </button>
            </div>
          `).join('')}
        </div>

        <!-- Comprehensive RBAC Permission Matrix Table -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div style="padding: 16px 20px; border-bottom: 1px solid var(--color-border);">
            <h3 class="card-title">Role Permission Matrix</h3>
            <p class="card-subtitle">Enforced across UI navigation, backend endpoints, and Nexa AI copilot</p>
          </div>
          <div style="overflow-x: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Platform Permission</th>
                  <th style="text-align: center;">Admin</th>
                  <th style="text-align: center;">Operations</th>
                  <th style="text-align: center;">Vendor</th>
                  <th style="text-align: center;">Warehouse</th>
                  <th style="text-align: center;">Logistics</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>View All Purchase Orders</strong></td>
                  <td style="text-align: center; color: var(--color-success);">✓ Full</td>
                  <td style="text-align: center; color: var(--color-success);">✓ Full</td>
                  <td style="text-align: center; color: #D97706;">Scoped (Own Only)</td>
                  <td style="text-align: center; color: #D97706;">Scoped (Hub Only)</td>
                  <td style="text-align: center; color: #D97706;">Scoped (Shipments)</td>
                </tr>
                <tr>
                  <td><strong>Create Purchase Orders</strong></td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                </tr>
                <tr>
                  <td><strong>Approve Purchase Orders</strong></td>
                  <td style="text-align: center; color: var(--color-success); font-weight: bold;">✓ Executive</td>
                  <td style="text-align: center; color: var(--color-error);">✕ Awaiting Admin</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                </tr>
                <tr>
                  <td><strong>View Supplier Commercial Rates</strong></td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-error);">✕ Competitor Block</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                </tr>
                <tr>
                  <td><strong>Receive Warehouse Shipments</strong></td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-success); font-weight: bold;">✓ Primary</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                </tr>
                <tr>
                  <td><strong>Update Freight Container Tracking</strong></td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-success);">✓</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-error);">✕</td>
                  <td style="text-align: center; color: var(--color-success); font-weight: bold;">✓ Primary</td>
                </tr>
                <tr>
                  <td><strong>Nexa AI Natural Language Scope</strong></td>
                  <td style="text-align: center; color: var(--color-success);">Global Organization</td>
                  <td style="text-align: center; color: var(--color-success);">Procurement & Logistics</td>
                  <td style="text-align: center; color: #D97706;">Northstar Supply Only</td>
                  <td style="text-align: center; color: #D97706;">East Coast Hub Only</td>
                  <td style="text-align: center; color: #D97706;">Active Containers Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.switch-role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roleKey = btn.dataset.role;
        store.setCurrentRole(roleKey);
        UsersView.render(container, onNavigate);
      });
    });
  }
}
