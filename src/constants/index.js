// API Configuration
export const API_BASE_URL = 'https://quanlyks.onrender.com/api';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'hotel_auth_token',
  USER: 'hotel_user_info'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  RECEPTIONIST: 'Receptionist',
  ACCOUNTANT: 'Accountant'
};

// User statuses
export const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended'
};

// Role statuses
export const ROLE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

// Room statuses
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning',
  OUT_OF_ORDER: 'out-of-order'
};

// Room statuses as array with label/value structure
export const ROOM_STATUSES = [
  { label: 'Sẵn có', value: 'available' },
  { label: 'Đã được đặt', value: 'occupied' },
  { label: 'Bảo trì', value: 'maintenance' },
  { label: 'Đang dọn dẹp', value: 'cleaning' },
  { label: 'Hỏng hóc', value: 'out-of-order' }
];

// Booking statuses
export const BOOKING_STATUS = {
  BOOKED: 'Booked',
  CHECKED_IN: 'CheckedIn',
  CHECKED_OUT: 'CheckedOut',
  CANCELLED: 'Cancelled'
};

// Booking statuses as array with label/value structure
export const BOOKING_STATUSES = [
  { label: 'Booked', value: BOOKING_STATUS.BOOKED },
  { label: 'Checked In', value: BOOKING_STATUS.CHECKED_IN },
  { label: 'Checked Out', value: BOOKING_STATUS.CHECKED_OUT },
  { label: 'Cancelled', value: BOOKING_STATUS.CANCELLED }
];

// Customer statuses
export const CUSTOMER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BLACKLISTED: 'Blacklisted'
};

// Room type statuses
export const ROOM_TYPE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

// Service statuses
export const SERVICE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

// Service categories
export const SERVICE_CATEGORIES = {
  FOOD_BEVERAGE: 'Food & Beverage',
  SPA_WELLNESS: 'Spa & Wellness',
  TRANSPORTATION: 'Transportation',
  ENTERTAINMENT: 'Entertainment',
  BUSINESS: 'Business Services',
  OTHER: 'Other'
};

// Invoice statuses
export const INVOICE_STATUS = {
  UNPAID: 'Unpaid',
  PAID: 'Paid',
  CANCELLED: 'Cancelled'
};

// Inventory statuses
export const INVENTORY_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

// Inventory categories
export const INVENTORY_CATEGORIES = {
  HOUSEKEEPING: 'Housekeeping',
  FOOD_BEVERAGE: 'Food & Beverage',
  MAINTENANCE: 'Maintenance', 
  AMENITIES: 'Amenities',
  OFFICE: 'Office Supplies',
  OTHER: 'Other'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss'
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  PHONE_VN: /^(0|84)[3|5|7|8|9][0-9]{8}$/,
  IDENTITY_CARD: /^[0-9]{9}$|^[0-9]{12}$/,
  USERNAME: /^[a-zA-Z0-9]{4,20}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
};

// Permissions for role management
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_CREATE: 'customers.create',
  CUSTOMERS_EDIT: 'customers.edit',
  CUSTOMERS_DELETE: 'customers.delete',
  ROOMS_VIEW: 'rooms.view',
  ROOMS_CREATE: 'rooms.create',
  ROOMS_EDIT: 'rooms.edit',
  ROOMS_DELETE: 'rooms.delete',
  BOOKINGS_VIEW: 'bookings.view',
  BOOKINGS_CREATE: 'bookings.create',
  BOOKINGS_EDIT: 'bookings.edit',
  BOOKINGS_DELETE: 'bookings.delete',
  INVOICES_VIEW: 'invoices.view',
  INVOICES_CREATE: 'invoices.create',
  INVOICES_EDIT: 'invoices.edit',
  INVOICES_DELETE: 'invoices.delete',
  ACCOUNTS_VIEW: 'accounts.view',
  ACCOUNTS_CREATE: 'accounts.create',
  ACCOUNTS_EDIT: 'accounts.edit',
  ACCOUNTS_DELETE: 'accounts.delete',
  ROLES_VIEW: 'roles.view',
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_DELETE: 'roles.delete',
  SERVICES_VIEW: 'services.view',
  SERVICES_CREATE: 'services.create',
  SERVICES_EDIT: 'services.edit',
  SERVICES_DELETE: 'services.delete',
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_CREATE: 'inventory.create',
  INVENTORY_EDIT: 'inventory.edit',
  INVENTORY_DELETE: 'inventory.delete',
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export'
};
