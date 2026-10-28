/**
 * NexaOps AI - Role-Based Access Control (RBAC) Service
 * Enforces role governance across the UI and AI assistant.
 * Note: Clearly marked as portfolio demo authorization logic.
 */

import { store } from '../data/store.js';

export const PERMISSION_MATRIX = {
  admin: {
    title: "Enterprise Administrator",
    canViewAllPOs: true,
    canCreatePO: true,
    canApprovePO: true,
    canEditPO: true,
    canCancelPO: true,
    canViewAllVendors: true,
    canViewVendorCommercials: true,
    canViewAllWarehouses: true,
    canUpdateInventory: true,
    canViewContainers: true,
    canUpdateLogistics: true,
    canViewAnalytics: true,
    canManageUsers: true,
    canAccessSettings: true,
    canUseAI: true,
    aiDataScope: "unrestricted"
  },
  operations: {
    title: "Operations & Procurement Lead",
    canViewAllPOs: true,
    canCreatePO: true,
    canApprovePO: false, // Requires executive sign-off
    canEditPO: true,
    canCancelPO: true,
    canViewAllVendors: true,
    canViewVendorCommercials: true,
    canViewAllWarehouses: true,
    canUpdateInventory: true,
    canViewContainers: true,
    canUpdateLogistics: true,
    canViewAnalytics: true,
    canManageUsers: false,
    canAccessSettings: false,
    canUseAI: true,
    aiDataScope: "procurement_logistics"
  },
  vendor: {
    title: "Vendor Representative",
    canViewAllPOs: false, // Scoped to assigned vendor only
    canCreatePO: false,
    canApprovePO: false,
    canEditPO: false,
    canCancelPO: false,
    canViewAllVendors: false, // Only own vendor profile
    canViewVendorCommercials: false, // Cannot see other vendors' rates
    canViewAllWarehouses: false,
    canUpdateInventory: false,
    canViewContainers: false, // Only containers assigned to this vendor
    canUpdateLogistics: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canAccessSettings: false,
    canUseAI: true,
    aiDataScope: "vendor_scoped"
  },
  warehouse: {
    title: "Warehouse Manager",
    canViewAllPOs: false, // Only POs routed to assigned warehouse
    canCreatePO: false,
    canApprovePO: false,
    canEditPO: false,
    canCancelPO: false,
    canViewAllVendors: false,
    canViewVendorCommercials: false,
    canViewAllWarehouses: true, // Can see other hubs for transfer
    canUpdateInventory: true,
    canViewContainers: true, // Incoming containers
    canUpdateLogistics: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canAccessSettings: false,
    canUseAI: true,
    aiDataScope: "warehouse_scoped"
  },
  logistics: {
    title: "Global Freight Specialist",
    canViewAllPOs: false, // Only logistics-linked POs
    canCreatePO: false,
    canApprovePO: false,
    canEditPO: false,
    canCancelPO: false,
    canViewAllVendors: false,
    canViewVendorCommercials: false,
    canViewAllWarehouses: true,
    canUpdateInventory: false,
    canViewContainers: true,
    canUpdateLogistics: true,
    canViewAnalytics: true,
    canManageUsers: false,
    canAccessSettings: false,
    canUseAI: true,
    aiDataScope: "logistics_scoped"
  }
};

export class RBACService {
  static getPermissions(roleKey = null) {
    const role = roleKey || store.getCurrentRoleKey();
    return PERMISSION_MATRIX[role] || PERMISSION_MATRIX.admin;
  }

  static can(permissionName, roleKey = null) {
    const permissions = this.getPermissions(roleKey);
    return Boolean(permissions[permissionName]);
  }

  static getActiveRoleExplanation() {
    const role = store.getCurrentRoleKey();
    const user = store.getCurrentUser();
    const perms = this.getPermissions(role);

    return {
      roleKey: role,
      roleTitle: perms.title,
      userName: user.name,
      description: user.description,
      permissions: perms
    };
  }

  static explainRefusal(action) {
    const role = store.getCurrentRoleKey();
    const user = store.getCurrentUser();

    switch (action) {
      case 'approve_po':
        return `Action Denied: Approving purchase orders requires the Enterprise Administrator role. You are currently operating as "${user.roleTitle}". Switch to "Admin" using the role selector in the top bar to test this workflow.`;
      case 'create_po':
        return `Action Denied: Creating purchase orders is reserved for Operations and Administrator roles. As a "${user.roleTitle}", you have read/tracking access only.`;
      case 'view_other_vendors':
        return `Access Restricted: In accordance with zero-trust tenancy, "${user.name}" can only access records belonging to Northstar Supply. Cross-vendor visibility is blocked.`;
      case 'manage_users':
        return `Administrative Notice: User governance and permission configuration are restricted to Enterprise Administrators.`;
      default:
        return `Permission Denied: Your current role (${user.roleTitle}) does not have permission to execute "${action}".`;
    }
  }
}
