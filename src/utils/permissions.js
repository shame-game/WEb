// Permission utilities
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  
  // Users & Roles
  USER_MANAGEMENT: 'users.manage',
  ROLE_MANAGEMENT: 'roles.manage',
  
  // Customers
  CUSTOMER_MANAGEMENT: 'customers.manage',
  CUSTOMER_READ: 'customers.view',
  
  // Rooms & Room Types
  ROOM_MANAGEMENT: 'rooms.manage',
  ROOM_READ: 'rooms.view',
  ROOM_TYPE_MANAGEMENT: 'roomTypes.manage',
  
  // Services
  SERVICE_MANAGEMENT: 'services.manage',
  SERVICE_READ: 'services.view',
  
  // Bookings
  BOOKING_MANAGEMENT: 'bookings.manage',
  BOOKING_READ: 'bookings.view',
  
  // Invoices
  INVOICE_MANAGEMENT: 'invoices.manage',
  INVOICE_READ: 'invoices.view',
  
  // Inventory
  INVENTORY_MANAGEMENT: 'inventory.manage',
  INVENTORY_READ: 'inventory.view',
  
  // Reports
  REPORTS_VIEW: 'reports.view'
};

// Role-based permissions mapping
export const ROLE_PERMISSIONS = {
  'Admin': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USER_MANAGEMENT,
    PERMISSIONS.ROLE_MANAGEMENT,
    PERMISSIONS.ROOM_MANAGEMENT,
    PERMISSIONS.ROOM_READ,
    PERMISSIONS.ROOM_TYPE_MANAGEMENT,
    PERMISSIONS.BOOKING_MANAGEMENT,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.CUSTOMER_MANAGEMENT,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.SERVICE_MANAGEMENT,
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.INVENTORY_MANAGEMENT,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.INVOICE_MANAGEMENT,
    PERMISSIONS.INVOICE_READ
  ],  'Receptionist': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ROOM_READ,
    PERMISSIONS.BOOKING_MANAGEMENT,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.CUSTOMER_MANAGEMENT,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.SERVICE_READ
  ],
  'Accountant': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.BOOKING_READ,
    PERMISSIONS.INVOICE_MANAGEMENT,
    PERMISSIONS.INVOICE_READ,
    PERMISSIONS.REPORTS_VIEW
  ]
};

// Get user permissions based on role
export const getUserPermissions = (userRole) => {
  if (!userRole) return [];
  return ROLE_PERMISSIONS[userRole] || [];
};

// Check if user has specific permission
export const hasPermission = (userRole, permission) => {
  const userPermissions = getUserPermissions(userRole);
  return userPermissions.includes(permission);
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (userRole, permissions) => {
  const userPermissions = getUserPermissions(userRole);
  return permissions.some(permission => userPermissions.includes(permission));
};

// Check if user has all of the specified permissions
export const hasAllPermissions = (userRole, permissions) => {
  const userPermissions = getUserPermissions(userRole);
  return permissions.every(permission => userPermissions.includes(permission));
};
