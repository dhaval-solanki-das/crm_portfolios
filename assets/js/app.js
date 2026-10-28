/**
 * NexaOps AI - Master Client Application Controller
 * Handles routing, persistent navigation, global search, notifications,
 * role synchronization, and view lifecycle management.
 */

import { store } from './data/store.js';
import { LandingView } from './views/landingView.js';
import { DashboardView } from './views/dashboardView.js';
import { AssistantView } from './views/assistantView.js';
import { PurchaseOrdersView } from './views/purchaseOrdersView.js';
import { VendorsView } from './views/vendorsView.js';
import { InventoryView } from './views/inventoryView.js';
import { WarehousesView } from './views/warehousesView.js';
import { ContainersView } from './views/containersView.js';
import { DocumentView } from './views/documentView.js';
import { VoiceView } from './views/voiceView.js';
import { UsersView } from './views/usersView.js';
import { ReportsView } from './views/reportsView.js';

class App {
  constructor() {
    this.currentView = 'landing'; // Starts on portfolio presentation
    this.viewOptions = {};
    this.init();
  }

  init() {
    this.bindGlobalEvents();
    this.syncRoleSelector();
    this.render();

    // Listen to store changes
    store.subscribe('role_changed', () => {
      this.syncRoleSelector();
      if (this.currentView !== 'landing') {
        this.renderView();
      }
    });

    store.subscribe('reset', () => {
      alert("Demo database reset to initial fictional state.");
      this.render();
    });
  }

  navigateTo(viewName, options = {}) {
    this.currentView = viewName;
    this.viewOptions = options;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  syncRoleSelector() {
    const user = store.getCurrentUser();
    const roleSelect = document.getElementById('topbar-role-select');
    const avatarEl = document.getElementById('sidebar-user-avatar');
    const nameEl = document.getElementById('sidebar-user-name');
    const roleEl = document.getElementById('sidebar-user-role');

    if (roleSelect) roleSelect.value = store.getCurrentRoleKey();
    if (avatarEl) avatarEl.textContent = user.avatar;
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.roleTitle;
  }

  bindGlobalEvents() {
    // Role selector change in topbar
    const roleSelect = document.getElementById('topbar-role-select');
    roleSelect?.addEventListener('change', (e) => {
      store.setCurrentRole(e.target.value);
    });

    // Reset demo button in banner
    document.getElementById('demo-reset-trigger')?.addEventListener('click', () => {
      if (confirm("Reset demo data? All newly created POs and modifications will be cleared.")) {
        store.resetDemoData();
      }
    });

    // Sidebar navigation clicks
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const targetView = item.dataset.view;
        if (targetView) {
          this.navigateTo(targetView);
        }
      });
    });

    // Top Try AI Assistant button
    document.getElementById('btn-try-ai-top')?.addEventListener('click', () => {
      this.navigateTo('assistant');
    });

    // Floating AI launcher
    document.getElementById('floating-ai-launcher')?.addEventListener('click', () => {
      this.navigateTo('assistant');
    });

    // Sidebar toggle for mobile
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    toggleBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
    });

    // Notifications Drawer
    const notifBtn = document.getElementById('notifications-btn');
    const notifPopover = document.getElementById('notifications-popover');
    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPopover?.classList.toggle('active');
    });
    document.addEventListener('click', () => {
      notifPopover?.classList.remove('active');
    });

    // Global Search Modal (Ctrl+K)
    const searchBtn = document.getElementById('global-search-trigger');
    const searchModal = document.getElementById('global-search-modal');
    const searchClose = document.getElementById('global-search-close');
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('global-search-results');

    const openSearch = () => {
      searchModal?.classList.add('active');
      searchInput?.focus();
      renderSearchResults('');
    };

    const closeSearch = () => {
      searchModal?.classList.remove('active');
      if (searchInput) searchInput.value = '';
    };

    searchBtn?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    });

    const renderSearchResults = (query) => {
      if (!searchResults) return;
      const q = query.toLowerCase().trim();

      const pos = store.getPurchaseOrders();
      const vendors = store.getVendors();
      const products = store.getProducts();
      const containers = store.getContainers();

      let matches = [];

      if (q) {
        pos.filter(p => p.poNumber.toLowerCase().includes(q) || p.vendorName.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
          .forEach(p => matches.push({ type: 'Purchase Order', title: `${p.poNumber} — ${p.vendorName}`, subtitle: `${p.sku} • $${p.lineTotal.toFixed(2)} USD`, view: 'purchase-orders', opt: { selectedPo: p.poNumber } }));

        vendors.filter(v => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q))
          .forEach(v => matches.push({ type: 'Vendor', title: v.name, subtitle: `${v.category} • Rating ★ ${v.rating}`, view: 'vendors' }));

        products.filter(p => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
          .forEach(p => matches.push({ type: 'Product', title: `${p.sku} — ${p.name}`, subtitle: `${p.availableQty} units available at ${p.warehouseName}`, view: 'inventory' }));

        containers.filter(c => c.id.toLowerCase().includes(q) || c.carrier.toLowerCase().includes(q))
          .forEach(c => matches.push({ type: 'Logistics Container', title: `${c.id} (${c.carrier})`, subtitle: `${c.originPort} → ${c.destinationPort}`, view: 'containers' }));
      } else {
        // Default suggestions
        matches = [
          { type: 'Quick Action', title: 'Open Nexa AI Assistant', subtitle: 'Natural language queries & PO drafting', view: 'assistant' },
          { type: 'Quick Action', title: 'Document Intelligence Studio', subtitle: 'Upload & extract POs via OCR', view: 'documents' },
          { type: 'Quick Action', title: 'Voice AI Studio', subtitle: 'Hands-free voice procurement', view: 'voice' },
          { type: 'Quick Action', title: 'Purchase Orders Registry', subtitle: 'View all 248 orders & pending approvals', view: 'purchase-orders' }
        ];
      }

      searchResults.innerHTML = matches.map(m => `
        <div class="search-result-item" data-view="${m.view}" ${m.opt?.selectedPo ? `data-po="${m.opt.selectedPo}"` : ''}>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <strong style="font-size: 13px; color: var(--color-navy);">${m.title}</strong>
            <span class="badge badge-neutral" style="font-size: 10px;">${m.type}</span>
          </div>
          <p style="font-size: 11px; color: var(--color-text-secondary); margin-top: 2px;">${m.subtitle}</p>
        </div>
      `).join('');

      searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const v = item.dataset.view;
          const po = item.dataset.po;
          closeSearch();
          this.navigateTo(v, po ? { selectedPo: po } : {});
        });
      });
    };

    searchInput?.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  render() {
    const appShell = document.getElementById('app-shell');
    const landingContainer = document.getElementById('landing-view-container');
    const mainTitle = document.getElementById('topbar-page-title');
    const floatingBtn = document.getElementById('floating-ai-launcher');

    if (this.currentView === 'landing') {
      if (appShell) appShell.style.display = 'none';
      if (landingContainer) {
        landingContainer.style.display = 'block';
        LandingView.render(landingContainer, (v, opt) => this.navigateTo(v, opt));
      }
      if (floatingBtn) floatingBtn.style.display = 'none';
      return;
    }

    // Inside Main SaaS Application
    if (landingContainer) landingContainer.style.display = 'none';
    if (appShell) appShell.style.display = 'flex';
    if (floatingBtn) floatingBtn.style.display = 'flex';

    // Update active nav state in sidebar
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
      if (item.dataset.view === this.currentView) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Page Title
    const titleMap = {
      dashboard: "Overview Dashboard",
      assistant: "Nexa AI Copilot",
      'purchase-orders': "Purchase Orders",
      vendors: "Vendors & Suppliers",
      inventory: "Products & Inventory",
      warehouses: "Warehouses & Logistics Hubs",
      containers: "Ocean & Rail Containers",
      documents: "Document Intelligence (OCR)",
      voice: "Voice AI Assistant",
      reports: "Reports & Analytics",
      users: "User Governance & RBAC Matrix",
      settings: "System Settings"
    };

    if (mainTitle) {
      mainTitle.textContent = titleMap[this.currentView] || "NexaOps AI";
    }

    this.renderView();
  }

  renderView() {
    const container = document.getElementById('content-viewport');
    if (!container) return;

    switch (this.currentView) {
      case 'dashboard':
        DashboardView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'assistant':
        AssistantView.render(container, (v, opt) => this.navigateTo(v, opt), this.viewOptions.prompt);
        break;
      case 'purchase-orders':
        PurchaseOrdersView.render(container, (v, opt) => this.navigateTo(v, opt), this.viewOptions);
        break;
      case 'vendors':
        VendorsView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'inventory':
        InventoryView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'warehouses':
        WarehousesView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'containers':
        ContainersView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'documents':
        DocumentView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'voice':
        VoiceView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'users':
        UsersView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'reports':
        ReportsView.render(container, (v, opt) => this.navigateTo(v, opt));
        break;
      case 'settings':
        this.renderSettingsView(container);
        break;
      default:
        DashboardView.render(container, (v, opt) => this.navigateTo(v, opt));
    }
  }

  renderSettingsView(container) {
    const currentUser = store.getCurrentUser();
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 800px;">
        <h2 style="font-size: 22px; font-weight: 800; color: var(--color-navy);">System Settings & Portfolio Environment</h2>
        
        <div class="card">
          <h3 class="card-title">Demo Session Identity</h3>
          <p class="card-subtitle">Active simulated session credentials</p>
          <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
            <div><span style="color: #64748B;">User:</span> <strong>${currentUser.name}</strong></div>
            <div><span style="color: #64748B;">Role Title:</span> <strong>${currentUser.roleTitle}</strong></div>
            <div><span style="color: #64748B;">Email:</span> <strong>${currentUser.email}</strong></div>
            <div><span style="color: #64748B;">Department:</span> <strong>${currentUser.department}</strong></div>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">Demonstration Compliance & Privacy Notice</h3>
          <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin-top: 8px;">
            This application is an interactive portfolio demonstration created for prospective client presentations.
            All purchase orders, supplier names, pricing tiers, container identifiers, and email addresses are fictional synthetic records.
            Zero confidential client information, proprietary secrets, or production tenant credentials are contained within this demo.
          </p>
          <div style="margin-top: 14px;">
            <button class="btn btn-secondary" onclick="window.location.reload()">
              Reload Application
            </button>
            <button class="btn btn-danger" id="settings-reset-demo-btn" style="margin-left: 10px;">
              Reset Local Storage
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#settings-reset-demo-btn')?.addEventListener('click', () => {
      store.resetDemoData();
    });
  }
}

// Bootstrap application on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.NexaOpsApp = new App();
});
