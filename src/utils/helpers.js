// Format currency to VND
export const formatCurrency = (amount) => {
  if (amount == null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY-MM-DDTHH:mm':
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

// Parse date from API format
export const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// Calculate days between dates
export const daysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Validate Vietnamese phone number
export const validatePhoneVN = (phone) => {
  const pattern = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
  return pattern.test(phone);
};

// Validate identity card
export const validateIdentityCard = (card) => {
  const pattern = /^[0-9]{9}$|^[0-9]{12}$/;
  return pattern.test(card);
};

// Validate username
export const validateUsername = (username) => {
  const pattern = /^[a-zA-Z0-9]{4,20}$/;
  return pattern.test(username);
};

// Validate password
export const validatePassword = (password) => {
  const pattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(password);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get status color
export const getStatusColor = (status, type = 'room') => {
  const statusColors = {
    room: {
      Available: '#10b981', // green
      Booked: '#f59e0b', // amber
      Maintenance: '#ef4444', // red
      Occupied: '#3b82f6' // blue
    },
    booking: {
      Booked: '#f59e0b', // amber
      CheckedIn: '#10b981', // green
      CheckedOut: '#6b7280', // gray
      Cancelled: '#ef4444' // red
    },
    invoice: {
      Unpaid: '#ef4444', // red
      Paid: '#10b981', // green
      Cancelled: '#6b7280' // gray
    },
    inventory: {
      InStock: '#10b981', // green
      LowStock: '#f59e0b', // amber
      OutOfStock: '#ef4444' // red
    }
  };
  
  return statusColors[type]?.[status] || '#6b7280';
};

// Generate random ID (for temporary use)
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Check if user has permission
export const hasPermission = (userRole, requiredRoles) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return requiredRoles.includes(userRole);
};
