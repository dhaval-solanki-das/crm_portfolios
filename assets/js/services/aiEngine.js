/**
 * NexaOps AI - Core AI Assistant Engine ("Nexa AI")
 * Implements conversational multi-agent orchestration, natural language
 * business queries, PO drafting workflows, and role-aware safety checks.
 */

import { store } from '../data/store.js';
import { RBACService } from './rbacService.js';

export class NexaAIEngine {
  constructor() {
    this.conversationHistory = [];
    this.pendingAction = null; // Holds draft POs or confirmation states
    this.apiKey = localStorage.getItem('nexaops_openrouter_key') || '';
    this.isLiveMode = Boolean(this.apiKey);
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem('nexaops_openrouter_key', this.apiKey);
      this.isLiveMode = true;
    } else {
      localStorage.removeItem('nexaops_openrouter_key');
      this.isLiveMode = false;
    }
  }

  getMode() {
    return this.isLiveMode ? 'Live LLM (OpenRouter / Gemini)' : 'Deterministic Demo Mode (Local Business Data)';
  }

  clearHistory() {
    this.conversationHistory = [];
    this.pendingAction = null;
  }

  /**
   * Primary entry point for chat messages
   */
  async processMessage(userMessage) {
    const rawText = userMessage.trim();
    const lower = rawText.toLowerCase();
    const currentRole = store.getCurrentRoleKey();
    const currentUser = store.getCurrentUser();

    // 1. Handle Active Confirmation Actions (e.g., "Yes, create it", "Confirm", "Cancel")
    if (this.pendingAction) {
      const result = this.handlePendingAction(lower, rawText);
      if (result) {
        this.conversationHistory.push({ role: 'user', content: rawText });
        this.conversationHistory.push({ role: 'assistant', ...result });
        return result;
      }
    }

    // 2. Role Permission Guardrail Check
    const roleCheck = this.checkRoleGuardrails(lower, currentRole, currentUser);
    if (roleCheck) {
      this.conversationHistory.push({ role: 'user', content: rawText });
      this.conversationHistory.push({ role: 'assistant', ...roleCheck });
      return roleCheck;
    }

    // 3. Multi-Agent Routing & Query Execution
    let response;
    
    // Purchase Order Creation Intent
    if (this.isPOCreationIntent(lower)) {
      response = this.handlePOCreationFlow(rawText);
    }
    // Pending Approvals Query
    else if (lower.includes('pending') || lower.includes('approval') || lower.includes('awaiting approval')) {
      response = this.handlePendingApprovalsQuery(lower);
    }
    // Vendor Performance & Outstanding Orders Query
    else if (lower.includes('vendor') || lower.includes('outstanding') || lower.includes('supplier')) {
      response = this.handleVendorsQuery(lower);
    }
    // Container & Logistics Tracking Query
    else if (lower.includes('container') || lower.includes('arriving') || lower.includes('shipment') || lower.includes('logistics')) {
      response = this.handleContainersQuery(lower);
    }
    // Stock & Inventory Query
    else if (lower.includes('stock') || lower.includes('inventory') || lower.includes('sku') || lower.includes('available')) {
      response = this.handleInventoryQuery(lower);
    }
    // Document Understanding Query
    else if (lower.includes('document') || lower.includes('read this') || lower.includes('ocr') || lower.includes('extract')) {
      response = this.handleDocumentGuidanceQuery();
    }
    // General Operational Summary Query
    else if (lower.includes('summary') || lower.includes('overview') || lower.includes('status') || lower.includes('metrics')) {
      response = this.handleOperationalSummaryQuery();
    }
    // Specific PO lookup (e.g., "PO-DEMO-1001" or "1001")
    else if (/po[- ]?demo[- ]?(\d+)/i.test(lower) || /po\s*#?\s*(\d{4})/i.test(lower)) {
      response = this.handleSinglePOLookup(lower);
    }
    // Small Talk / System Greeting / Help
    else if (lower.includes('help') || lower.includes('who are you') || lower.includes('what can you do') || lower.includes('hello') || lower.includes('hi')) {
      response = this.handleHelpQuery();
    }
    // Fallback / Broad Semantic Search
    else {
      response = this.handleGeneralBusinessQuery(rawText);
    }

    this.conversationHistory.push({ role: 'user', content: rawText });
    this.conversationHistory.push({ role: 'assistant', ...response });
    return response;
  }

  // -------------------------
  // Intent Classifiers
  // -------------------------
  isPOCreationIntent(lower) {
    return lower.includes('create') && (lower.includes('order') || lower.includes('po') || lower.includes('purchase order')) ||
           lower.includes('draft a po') ||
           lower.includes('prepare a purchase order') ||
           lower.includes('new purchase order');
  }

  // -------------------------
  // Role Guardrails
  // -------------------------
  checkRoleGuardrails(lower, currentRole, currentUser) {
    // If user is a Vendor, they cannot inspect other vendors or approve orders
    if (currentRole === 'vendor') {
      if (lower.includes('other vendor') || lower.includes('all vendors') || lower.includes('bluepeak') || lower.includes('quantum') || lower.includes('competitor')) {
        return {
          content: `**Access Restricted (RBAC Policy Enforcement)**\n\nAs a **Vendor Representative** (${currentUser.department}), your access scope is restricted strictly to Northstar Supply records.\n\nYou do not have authorization to view competitor pricing, terms, or purchase orders.`,
          status: 'error',
          badge: 'RBAC Restriction'
        };
      }
      if (lower.includes('approve') || lower.includes('sign off')) {
        return {
          content: `**Authorization Denied**\n\nVendor accounts cannot approve purchase orders. Approvals require the **Enterprise Administrator** role.`,
          status: 'error',
          badge: 'RBAC Restriction'
        };
      }
    }

    // If user is Warehouse, they cannot execute corporate procurement writes
    if (currentRole === 'warehouse') {
      if (this.isPOCreationIntent(lower)) {
        return {
          content: `**Role Permission Notice**\n\nWarehouse personnel (${currentUser.roleTitle}) have read and receiving access. Commercial procurement orders must be drafted by **Operations** or **Administrator** roles. Switch roles in the top bar to test PO creation.`,
          status: 'error',
          badge: 'RBAC Restriction'
        };
      }
    }

    return null;
  }

  // -------------------------
  // Purchase Order Creation Flow
  // -------------------------
  handlePOCreationFlow(rawText) {
    const lower = rawText.toLowerCase();
    
    // Check if role can create POs
    if (!RBACService.can('canCreatePO')) {
      return {
        content: RBACService.explainRefusal('create_po'),
        status: 'error'
      };
    }

    // Extract quantity (e.g., 150 units)
    let quantity = 100;
    const qtyMatch = rawText.match(/(\d+)\s*(?:units?|pcs?|pieces?|items?)?/i);
    if (qtyMatch && parseInt(qtyMatch[1], 10) > 0) {
      quantity = parseInt(qtyMatch[1], 10);
    }

    // Extract SKU (e.g., DEMO-104)
    let matchedProduct = null;
    const allProducts = store.getProducts();
    const skuMatch = rawText.match(/DEMO[- ]?(\d+)/i);
    if (skuMatch) {
      const targetSku = `DEMO-${skuMatch[1]}`;
      matchedProduct = allProducts.find(p => p.sku.toUpperCase() === targetSku.toUpperCase());
    }

    // If SKU not specified, check product names
    if (!matchedProduct) {
      if (lower.includes('cooling') || lower.includes('fan')) {
        matchedProduct = allProducts.find(p => p.sku === 'DEMO-104');
      } else if (lower.includes('sensor') || lower.includes('optic')) {
        matchedProduct = allProducts.find(p => p.sku === 'DEMO-208');
      } else if (lower.includes('rack') || lower.includes('server')) {
        matchedProduct = allProducts.find(p => p.sku === 'DEMO-101');
      } else if (lower.includes('gateway') || lower.includes('iot')) {
        matchedProduct = allProducts.find(p => p.sku === 'DEMO-522');
      } else if (lower.includes('pallet') || lower.includes('cargo')) {
        matchedProduct = allProducts.find(p => p.sku === 'DEMO-415');
      } else {
        // Default to low-stock cooling unit
        matchedProduct = allProducts.find(p => p.sku === 'DEMO-104');
      }
    }

    // Vendor resolution
    let matchedVendor = null;
    const allVendors = store.getVendors();
    if (matchedProduct) {
      matchedVendor = allVendors.find(v => v.id === matchedProduct.vendorId);
    }
    if (!matchedVendor) {
      matchedVendor = allVendors.find(v => lower.includes(v.name.toLowerCase())) || allVendors[0];
    }

    // Unit price and math
    let unitPrice = matchedProduct ? matchedProduct.unitPrice : 24.50;
    const priceMatch = rawText.match(/\$?\s*(\d+(?:\.\d{1,2})?)\s*(?:per\s*unit|dollars?)/i);
    if (priceMatch) {
      unitPrice = parseFloat(priceMatch[1]);
    }

    const lineTotal = parseFloat((quantity * unitPrice).toFixed(2));
    const targetWarehouse = store.getWarehouses()[0];

    // Save pending action
    this.pendingAction = {
      type: 'CONFIRM_PO_CREATION',
      draftData: {
        vendorId: matchedVendor.id,
        vendorName: matchedVendor.name,
        sku: matchedProduct ? matchedProduct.sku : 'DEMO-104',
        productName: matchedProduct ? matchedProduct.name : 'High-Efficiency Dual-Fan Cooling Unit',
        quantity,
        unitPrice,
        lineTotal,
        warehouseId: targetWarehouse.id,
        warehouseName: targetWarehouse.name,
        notes: `Created via Nexa AI assistant upon prompt: "${rawText.slice(0, 80)}"`
      }
    };

    return {
      content: `I have prepared a draft purchase order based on your operational instructions.\n\n**Action Confirmation Required:** Please review the details below before creating this order in the demo data registry:`,
      actionCard: {
        type: 'purchase_order_draft',
        title: 'Draft Purchase Order Preview',
        vendor: matchedVendor.name,
        vendorEmail: matchedVendor.email,
        sku: matchedProduct ? matchedProduct.sku : 'DEMO-104',
        productName: matchedProduct ? matchedProduct.name : 'High-Efficiency Dual-Fan Cooling Unit',
        quantity,
        unitPrice: `$${unitPrice.toFixed(2)}`,
        lineTotal: `$${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`,
        warehouse: targetWarehouse.name,
        status: 'Awaiting User Confirmation'
      },
      quickReplies: ['Yes, create it', 'Cancel order'],
      status: 'pending_confirmation'
    };
  }

  // -------------------------
  // Pending Action Execution
  // -------------------------
  handlePendingAction(lower, rawText) {
    if (this.pendingAction.type === 'CONFIRM_PO_CREATION') {
      if (lower.includes('yes') || lower.includes('create') || lower.includes('confirm') || lower.includes('proceed') || lower.includes('ok')) {
        const draft = this.pendingAction.draftData;
        const newPO = store.createPurchaseOrder({
          ...draft,
          createdSource: 'Nexa AI Natural Language Workflow'
        });
        this.pendingAction = null;

        return {
          content: `**Purchase Order Successfully Created**\n\nYour order **[${newPO.poNumber}](#po-${newPO.poNumber})** has been created in the operational registry.\n\n- **Order Number:** \`${newPO.poNumber}\`\n- **Vendor:** ${newPO.vendorName}\n- **Item:** ${newPO.quantity}x ${newPO.sku} (${newPO.productName})\n- **Total Amount:** $${newPO.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD\n- **Status:** **Pending Approval** (Awaiting Executive Review)\n- **Assigned Hub:** ${newPO.warehouseName}\n\n*Note: In accordance with governance rules, orders are not automatically approved upon creation.*`,
          quickReplies: ['Show me pending purchase orders', 'Check stock availability in the demo warehouse', 'Overview Dashboard'],
          status: 'success',
          createdPo: newPO
        };
      } else if (lower.includes('cancel') || lower.includes('no') || lower.includes('abort') || lower.includes('stop')) {
        this.pendingAction = null;
        return {
          content: `The purchase order draft has been cancelled. No changes were committed to the demo database.`,
          quickReplies: ['Show me pending purchase orders', 'Which vendors have the most outstanding orders?'],
          status: 'info'
        };
      }
    }
    return null;
  }

  // -------------------------
  // Query Handlers
  // -------------------------
  handlePendingApprovalsQuery(lower) {
    const allPOs = store.getPurchaseOrders();
    const pending = allPOs.filter(p => p.status === 'Pending Approval');

    if (pending.length === 0) {
      return {
        content: `**Pending Approvals:** There are currently no purchase orders awaiting approval. All active orders are verified.`,
        status: 'success'
      };
    }

    const tableRows = pending.map(po => ({
      poNumber: po.poNumber,
      vendor: po.vendorName,
      sku: po.sku,
      quantity: po.quantity,
      total: `$${po.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      expected: po.expectedDeliveryDate,
      action: 'Review'
    }));

    const totalPendingValue = pending.reduce((sum, p) => sum + p.lineTotal, 0);

    return {
      content: `Found **${pending.length} purchase order(s)** awaiting administrative approval totaling **$${totalPendingValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD**:`,
      table: {
        columns: ['PO Number', 'Vendor', 'SKU', 'Quantity', 'Line Total', 'Expected Delivery'],
        rows: tableRows.map(r => [r.poNumber, r.vendor, r.sku, r.quantity, r.total, r.expected])
      },
      quickReplies: ['Explain why a purchase order is awaiting approval', 'Check stock availability in the demo warehouse'],
      status: 'success'
    };
  }

  handleVendorsQuery(lower) {
    const vendors = store.getVendors();
    const pos = store.getPurchaseOrders();

    // Calculate vendor breakdown
    const vendorStats = vendors.map(v => {
      const vendorPOs = pos.filter(p => p.vendorId === v.id);
      const activePOs = vendorPOs.filter(p => p.status !== 'Cancelled' && p.status !== 'Received');
      const openCommitment = activePOs.reduce((sum, p) => sum + p.lineTotal, 0);
      return {
        id: v.id,
        name: v.name,
        category: v.category,
        rating: v.rating,
        leadTime: `${v.leadTimeDays} days`,
        openOrders: activePOs.length,
        openCommitment: `$${openCommitment.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      };
    }).sort((a, b) => b.openOrders - a.openOrders);

    return {
      content: `Here is the current vendor performance and open order breakdown:`,
      table: {
        columns: ['Vendor', 'Category', 'Rating', 'Lead Time', 'Open POs', 'Open Commitment'],
        rows: vendorStats.map(v => [v.name, v.category, `★ ${v.rating}`, v.leadTime, v.openOrders, v.openCommitment])
      },
      quickReplies: ['Show me pending purchase orders', 'Find containers arriving this week'],
      status: 'success'
    };
  }

  handleContainersQuery(lower) {
    const containers = store.getContainers();
    
    const tableRows = containers.map(c => [
      c.id,
      c.associatedVendor,
      c.carrier,
      `${c.originPort} → ${c.destinationPort}`,
      c.logisticsStatus,
      c.expectedArrival
    ]);

    return {
      content: `Found **${containers.length} active shipping containers** in transit across ocean and intermodal freight corridors:`,
      table: {
        columns: ['Container ID', 'Vendor', 'Carrier', 'Transit Route', 'Status', 'ETA'],
        rows: tableRows
      },
      quickReplies: ['Check stock availability in the demo warehouse', 'Show me pending purchase orders'],
      status: 'success'
    };
  }

  handleInventoryQuery(lower) {
    const products = store.getProducts();
    const lowStock = products.filter(p => p.availableQty <= p.reorderThreshold);

    let summaryText = `**Inventory Status Report:**\nTotal tracked SKUs: **${products.length} items**. `;
    if (lowStock.length > 0) {
      summaryText += `⚠️ **${lowStock.length} SKU(s) require replenishment:**\n\n`;
      lowStock.forEach(item => {
        summaryText += `- **${item.sku}** (${item.name}): **${item.availableQty} units** available (Reorder threshold: ${item.reorderThreshold}). Supplier: ${item.vendorName}.\n`;
      });
    } else {
      summaryText += `All inventory items are currently above their safety thresholds.\n`;
    }

    const tableRows = products.map(p => [
      p.sku,
      p.name,
      p.availableQty,
      p.reorderThreshold,
      p.warehouseName,
      p.status
    ]);

    return {
      content: summaryText,
      table: {
        columns: ['SKU', 'Product Name', 'Available Qty', 'Reorder Point', 'Warehouse', 'Status'],
        rows: tableRows
      },
      quickReplies: ['Create a purchase order for 150 units of SKU DEMO-104', 'Find containers arriving this week'],
      status: 'success'
    };
  }

  handleDocumentGuidanceQuery() {
    return {
      content: `**Document Intelligence Workflow:**\n\nNexaOps AI includes dedicated Computer Vision & OCR capabilities for processing invoices, typed purchase orders, handwritten requisition notes, and vendor quotations.\n\n**To test document extraction:**\n1. Open the **Document Intelligence** tab from the sidebar.\n2. Choose from pre-loaded demonstration documents (Typed PO, Scanned Bill of Lading, Handwritten Note, or Vendor Quote), or upload your own sample (PDF, PNG, JPG, XLSX, CSV, TXT).\n3. Inspect extracted fields with confidence scoring.\n4. Click **"Convert to Purchase Order"** to validate and automatically generate a draft PO.`,
      quickReplies: ['Show me pending purchase orders', 'Overview Dashboard'],
      status: 'info'
    };
  }

  handleOperationalSummaryQuery() {
    const metrics = store.getMetrics();
    return {
      content: `**NexaOps AI Operational Summary (Fictional Demo Environment):**\n\n- **Total Purchase Orders:** ${metrics.totalPurchaseOrders}\n- **Pending Executive Approvals:** ${metrics.pendingApprovals}\n- **Active Suppliers:** ${metrics.activeVendors}\n- **Operating Warehouses:** ${metrics.activeWarehouses}\n- **Active Ocean/Rail Containers:** ${metrics.activeContainers}\n- **Tracked Inventory Items:** ${metrics.inventoryItems.toLocaleString()} SKUs\n- **On-Time Delivery SLA:** ${metrics.onTimeDeliveryRate}%\n\n*All records are generated for demonstration purposes.*`,
      quickReplies: ['Show me pending purchase orders', 'Which vendors have the most outstanding orders?'],
      status: 'success'
    };
  }

  handleSinglePOLookup(lower) {
    const pos = store.getPurchaseOrders();
    const po = pos.find(p => lower.includes(p.poNumber.toLowerCase()) || lower.includes(p.poNumber.split('-')[2]));

    if (!po) {
      return {
        content: `I could not locate a purchase order matching that reference in the demo registry.`,
        status: 'error'
      };
    }

    return {
      content: `**Purchase Order Details:**\n\n- **PO Number:** \`${po.poNumber}\`\n- **Vendor:** ${po.vendorName}\n- **Item:** ${po.quantity}x ${po.sku} (${po.productName})\n- **Unit Price:** $${po.unitPrice.toFixed(2)} | **Total:** $${po.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${po.currency}\n- **Status:** **${po.status}** (${po.approvalStatus})\n- **Order Date:** ${po.orderDate} | **Expected Delivery:** ${po.expectedDeliveryDate}\n- **Destination:** ${po.warehouseName}\n- **Notes:** ${po.notes}`,
      quickReplies: ['Show me pending purchase orders', 'Explain why a purchase order is awaiting approval'],
      status: 'success'
    };
  }

  handleHelpQuery() {
    return {
      content: `Hello! I'm **Nexa AI**, the intelligent business assistant powering the NexaOps operations platform.\n\n**Here are common workflows you can ask me to perform:**\n- *"Show me pending purchase orders."*\n- *"Which vendors have the most outstanding orders?"*\n- *"Create a purchase order for 150 units of SKU DEMO-104."*\n- *"Find containers arriving this week."*\n- *"Check stock availability in the demo warehouse."*\n- *"Explain why a purchase order is awaiting approval."*\n- *"Summarize the latest inventory changes."*`,
      quickReplies: [
        'Show me pending purchase orders.',
        'Which vendors have the most outstanding orders?',
        'Create a purchase order for 150 units of SKU DEMO-104.',
        'Find containers arriving this week.'
      ],
      status: 'info'
    };
  }

  handleGeneralBusinessQuery(rawText) {
    return {
      content: `I processed your request regarding *"**${rawText}**"* against our operational registry.\n\nNexa AI coordinates Data Agents, Purchase Order Agents, and Logistics Agents. Try asking for specific operations such as checking inventory, reviewing pending purchase orders, or preparing a new order draft.`,
      quickReplies: [
        'Show me pending purchase orders.',
        'Check stock availability in the demo warehouse.',
        'Find containers arriving this week.'
      ],
      status: 'info'
    };
  }
}

export const aiEngine = new NexaAIEngine();
