// Mock Data for Hotel Management System
import { 
  ROOM_STATUS, 
  BOOKING_STATUS, 
  USER_STATUS, 
  ROLE_STATUS,
  SERVICE_STATUS,
  INVENTORY_STATUS,
  CUSTOMER_STATUS,
  ROOM_TYPE_STATUS,
  SERVICE_CATEGORIES,
  INVENTORY_CATEGORIES
} from '../constants';

// Users/Accounts Mock Data
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    displayName: 'Administrator',
    email: 'admin@hotel.com',
    phone: '0901234567',
    roleId: 1,
    roleName: 'Admin',
    status: USER_STATUS.ACTIVE,
    avatar: null,
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2024-12-01T09:30:00Z'
  },
  {
    id: 2,
    username: 'receptionist',
    password: 'rec12345',
    firstName: 'Nguyễn Thị',
    lastName: 'Lan',
    displayName: 'Nguyễn Thị Lan',
    email: 'lan@hotel.com',
    phone: '0907654321',
    roleId: 2,
    roleName: 'Receptionist',
    status: USER_STATUS.ACTIVE,
    avatar: null,
    createdAt: '2024-02-01T08:00:00Z',
    lastLogin: '2024-11-30T14:20:00Z'
  },
  {
    id: 3,
    username: 'accountant',
    password: 'acc12345',
    firstName: 'Trần Văn',
    lastName: 'Hùng',
    displayName: 'Trần Văn Hùng',
    email: 'hung@hotel.com',
    phone: '0912345678',
    roleId: 3,
    roleName: 'Accountant',
    status: USER_STATUS.ACTIVE,
    avatar: null,
    createdAt: '2024-02-15T08:00:00Z',
    lastLogin: '2024-11-29T16:45:00Z'
  }
];

// Roles Mock Data
export const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Quản trị viên hệ thống',
    permissions: ['dashboard.view', 'users.manage', 'roles.manage', 'rooms.manage', 'bookings.manage', 'customers.manage', 'services.manage', 'inventory.manage', 'reports.view'],
    status: ROLE_STATUS.ACTIVE,
    userCount: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Receptionist',
    description: 'Nhân viên lễ tân',
    permissions: ['dashboard.view', 'rooms.view', 'bookings.manage', 'customers.manage', 'services.view'],
    status: ROLE_STATUS.ACTIVE,
    userCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 3,
    name: 'Accountant',
    description: 'Nhân viên kế toán',
    permissions: ['dashboard.view', 'bookings.view', 'invoices.manage', 'reports.view'],
    status: ROLE_STATUS.ACTIVE,
    userCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-10T14:20:00Z'
  }
];

// Customers Mock Data
export const mockCustomers = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0901234567',
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    identityCard: '123456789',
    dateOfBirth: '1985-05-15',
    nationality: 'Việt Nam',
    status: CUSTOMER_STATUS.ACTIVE,
    totalBookings: 5,
    totalSpent: 15000000,
    loyaltyPoints: 150,
    createdAt: '2024-01-15T10:30:00Z',
    lastBooking: '2024-11-20T00:00:00Z'
  },
  {
    id: 2,
    fullName: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '0907654321',
    address: '456 Lê Lợi, Quận 3, TP.HCM',
    identityCard: '987654321',
    dateOfBirth: '1990-08-22',
    nationality: 'Việt Nam',
    status: CUSTOMER_STATUS.ACTIVE,
    totalBookings: 3,
    totalSpent: 8500000,
    loyaltyPoints: 85,
    createdAt: '2024-02-01T14:20:00Z',
    lastBooking: '2024-11-15T00:00:00Z'
  }
];

// Room Types Mock Data
export const mockRoomTypes = [
  {
    id: 1,
    name: 'Standard Room',
    description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản',
    basePrice: 800000,
    maxOccupancy: 2,
    amenities: ['Wi-Fi miễn phí', 'Điều hòa', 'TV', 'Tủ lạnh mini', 'Phòng tắm riêng'],
    roomCount: 20,
    availableRooms: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Deluxe Room',
    description: 'Phòng cao cấp với view đẹp và tiện nghi sang trọng',
    basePrice: 1200000,
    maxOccupancy: 3,
    amenities: ['Wi-Fi miễn phí', 'Điều hòa', 'Smart TV', 'Tủ lạnh', 'Ban công', 'Bồn tắm', 'Room service 24/7'],
    roomCount: 15,
    availableRooms: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Suite Room',
    description: 'Phòng suite rộng rãi với phòng khách riêng biệt',
    basePrice: 2000000,
    maxOccupancy: 4,
    amenities: ['Wi-Fi miễn phí', 'Điều hòa', 'Smart TV', 'Phòng khách riêng', 'Bếp nhỏ', 'Jacuzzi', 'Butler service'],
    roomCount: 10,
    availableRooms: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Rooms Mock Data
export const mockRooms = [
  {
    id: 1,
    roomNumber: '101',
    roomTypeId: 1,
    roomTypeName: 'Standard Room',
    floor: 1,    price: 800000,
    status: 'available',
    description: 'Phòng tiêu chuẩn tầng 1',
    lastCleaned: '2024-12-01T10:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    roomNumber: '102',
    roomTypeId: 1,
    roomTypeName: 'Standard Room',
    floor: 1,    price: 800000,
    status: 'occupied',
    description: 'Phòng tiêu chuẩn tầng 1',
    lastCleaned: '2024-11-30T14:00:00Z',
    currentBookingId: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    roomNumber: '201',
    roomTypeId: 2,
    roomTypeName: 'Deluxe Room',
    floor: 2,    price: 1200000,
    status: 'maintenance',
    description: 'Phòng deluxe tầng 2',
    lastCleaned: '2024-11-28T16:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    roomNumber: '202',
    roomTypeId: 2,
    roomTypeName: 'Deluxe Room',
    floor: 2,    price: 1200000,
    status: 'available',
    description: 'Phòng deluxe tầng 2 với view đẹp',
    lastCleaned: '2024-12-01T08:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    roomNumber: '301',
    roomTypeId: 3,
    roomTypeName: 'Suite Room',
    floor: 3,    price: 2000000,
    status: 'cleaning',
    description: 'Suite cao cấp với phòng khách riêng',
    lastCleaned: '2024-11-30T16:00:00Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Bookings Mock Data
export const mockBookings = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Nguyễn Văn An',
    roomId: 2,
    roomNumber: '102',
    roomTypeName: 'Standard Room',
    checkInDate: '2024-11-28',
    checkOutDate: '2024-12-02',
    adults: 2,
    children: 0,
    totalAmount: 3200000,
    status: BOOKING_STATUS.CHECKED_IN,
    specialRequests: 'Giường đôi, view hướng biển',
    paymentStatus: 'PAID',
    createdAt: '2024-11-25T14:30:00Z',
    services: [
      { id: 1, name: 'Spa Package', price: 500000 },
      { id: 2, name: 'Airport Transfer', price: 200000 }
    ]
  },
  {
    id: 2,
    customerId: 2,
    customerName: 'Trần Thị Bình',
    roomId: 3,
    roomNumber: '201',
    roomTypeName: 'Deluxe Room',
    checkInDate: '2024-12-05',
    checkOutDate: '2024-12-08',
    adults: 1,
    children: 1,
    totalAmount: 3600000,
    status: BOOKING_STATUS.CONFIRMED,
    specialRequests: 'Tầng cao, không hút thuốc',
    paymentStatus: 'PENDING',
    createdAt: '2024-11-20T09:15:00Z',
    services: []
  }
];

// Services Mock Data
export const mockServices = [
  {
    id: 1,
    name: 'Spa Package',
    description: 'Gói massage và thư giãn toàn thân',
    category: SERVICE_CATEGORIES.SPA_WELLNESS,
    price: 500000,
    duration: 90,
    maxCapacity: 4,
    isAvailable24h: false,
    startTime: '09:00',
    endTime: '21:00',
    rating: 4.8,
    reviewCount: 124,
    status: SERVICE_STATUS.ACTIVE,
    requirements: 'Đặt trước 2 tiếng',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Airport Transfer',
    description: 'Dịch vụ đưa đón sân bay',
    category: SERVICE_CATEGORIES.TRANSPORTATION,
    price: 200000,
    duration: 60,
    maxCapacity: 4,
    isAvailable24h: true,
    rating: 4.5,
    reviewCount: 89,
    status: SERVICE_STATUS.ACTIVE,
    requirements: 'Đặt trước 4 tiếng',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Room Service',
    description: 'Phục vụ đồ ăn tại phòng',
    category: SERVICE_CATEGORIES.FOOD_BEVERAGE,
    price: 50000,
    duration: 30,
    maxCapacity: 8,
    isAvailable24h: true,
    rating: 4.3,
    reviewCount: 256,
    status: SERVICE_STATUS.ACTIVE,
    requirements: 'Phí phục vụ cơ bản',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Inventory Mock Data
export const mockInventory = [
  {
    id: 1,
    name: 'Khăn tắm',
    sku: 'TOWEL001',
    description: 'Khăn tắm cotton cao cấp',
    category: INVENTORY_CATEGORIES.HOUSEKEEPING,
    unit: 'cái',
    unitPrice: 150000,
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    supplier: 'Công ty TNHH Vải Việt',
    lastRestocked: '2024-11-15T00:00:00Z',
    status: INVENTORY_STATUS.ACTIVE
  },
  {
    id: 2,
    name: 'Dầu gội',
    sku: 'SHAMPOO001',
    description: 'Dầu gội cao cấp 30ml',
    category: INVENTORY_CATEGORIES.AMENITIES,
    unit: 'chai',
    unitPrice: 25000,
    currentStock: 15,
    minStock: 50,
    maxStock: 200,
    supplier: 'Unilever Vietnam',
    lastRestocked: '2024-10-20T00:00:00Z',
    status: INVENTORY_STATUS.ACTIVE
  },
  {
    id: 3,
    name: 'Giấy vệ sinh',
    sku: 'TISSUE001',
    description: 'Giấy vệ sinh 2 lớp',
    category: INVENTORY_CATEGORIES.HOUSEKEEPING,
    unit: 'cuộn',
    unitPrice: 12000,
    currentStock: 0,
    minStock: 30,
    maxStock: 150,
    supplier: 'Công ty Giấy Sài Gòn',
    lastRestocked: '2024-09-30T00:00:00Z',
    status: INVENTORY_STATUS.ACTIVE
  }
];

// Dashboard Stats Mock Data
export const mockDashboardStats = {
  totalRooms: 45,
  availableRooms: 29,
  totalBookings: 156,
  monthlyRevenue: 450000000,
  occupancyRate: 75,
  checkInsToday: 8,
  checkOutsToday: 5,
  pendingPayments: 12
};

// Revenue Data for Charts
export const mockRevenueData = [
  { month: 'Jan', revenue: 35000000 },
  { month: 'Feb', revenue: 42000000 },
  { month: 'Mar', revenue: 38000000 },
  { month: 'Apr', revenue: 45000000 },
  { month: 'May', revenue: 48000000 },
  { month: 'Jun', revenue: 52000000 },
  { month: 'Jul', revenue: 58000000 },
  { month: 'Aug', revenue: 55000000 },
  { month: 'Sep', revenue: 47000000 },
  { month: 'Oct', revenue: 43000000 },
  { month: 'Nov', revenue: 46000000 },
  { month: 'Dec', revenue: 45000000 }
];

// Occupancy Data
export const mockOccupancyData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  occupancyRate: Math.floor(Math.random() * 40) + 60,
  available: Math.floor(Math.random() * 20) + 20
}));

// Room Type Distribution
export const mockRoomTypeData = [
  { name: 'Standard', count: 20, revenue: 120000000 },
  { name: 'Deluxe', count: 15, revenue: 180000000 },
  { name: 'Suite', count: 10, revenue: 150000000 }
];

// Recent Bookings for Dashboard
export const mockRecentBookings = [
  {
    id: 1,
    guestName: 'Nguyễn Văn An',
    roomNumber: '102',
    checkInDate: '2024-11-28',
    status: BOOKING_STATUS.CHECKED_IN
  },
  {
    id: 2,
    guestName: 'Trần Thị Bình',
    roomNumber: '201',
    checkInDate: '2024-12-05',
    status: BOOKING_STATUS.CONFIRMED
  }
];

// Reports Data
export const mockReportsData = {
  summary: {
    totalRevenue: 45000000,
    revenueGrowth: 12.5,
    occupancyRate: 75,
    occupancyGrowth: 8.3,
    totalBookings: 156,
    bookingsGrowth: 15.2,
    avgDailyRate: 1200000,
    adrGrowth: 5.7,
    roomRevenue: 35000000,
    roomRevenueGrowth: 10.2,
    serviceRevenue: 10000000,
    serviceRevenueGrowth: 18.5
  },
  revenue: mockRevenueData,
  occupancy: mockOccupancyData,
  roomTypes: mockRoomTypeData,
  bookings: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bookings: Math.floor(Math.random() * 10) + 5
  })),
  services: [
    { name: 'Spa & Wellness', revenue: 15000000, usage: 45 },
    { name: 'Food & Beverage', revenue: 25000000, usage: 78 },
    { name: 'Transportation', revenue: 8000000, usage: 32 }
  ],
  customerMetrics: {
    newCustomers: 45,
    repeatCustomers: 28,
    retentionRate: 68,
    avgStayDuration: 3.2
  }
};

// Invoices Mock Data
export const mockInvoices = [
  {
    id: 1,
    invoiceId: 1,
    bookingId: 1,
    customerName: 'Nguyễn Văn An',
    roomNumber: '102',
    issueDate: '2024-11-28',
    dueDate: '2024-12-02',
    subtotal: 3200000,
    taxAmount: 320000,
    totalAmount: 3520000,
    paidAmount: 3520000,
    status: 'PAID',
    paymentMethod: 'CREDIT_CARD',
    items: [
      { description: 'Room charge (4 nights)', amount: 3200000 },
      { description: 'Service charge', amount: 0 }
    ]
  },
  {
    id: 2,
    invoiceId: 2,
    bookingId: 2,
    customerName: 'Trần Thị Bình',
    roomNumber: '201',
    issueDate: '2024-12-05',
    dueDate: '2024-12-08',
    subtotal: 3600000,
    taxAmount: 360000,
    totalAmount: 3960000,
    paidAmount: 0,
    status: 'PENDING',
    paymentMethod: null,
    items: [
      { description: 'Room charge (3 nights)', amount: 3600000 }
    ]
  }
];
