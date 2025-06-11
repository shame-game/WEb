// Session Storage Data Manager for Hotel Management System
import {
  mockUsers,
  mockRoles,
  mockCustomers,
  mockRoomTypes,
  mockRooms,
  mockBookings,
  mockServices,
  mockInventory,
  mockDashboardStats,
  mockRevenueData,
  mockOccupancyData,
  mockRoomTypeData,
  mockRecentBookings,
  mockReportsData,
  mockInvoices
} from './mockData';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'hotel_users',
  ROLES: 'hotel_roles',
  CUSTOMERS: 'hotel_customers',
  ROOM_TYPES: 'hotel_room_types',
  ROOMS: 'hotel_rooms',
  BOOKINGS: 'hotel_bookings',
  SERVICES: 'hotel_services',
  INVENTORY: 'hotel_inventory',
  INVOICES: 'hotel_invoices'
};

// Helper functions
const loadFromStorage = (key, defaultData) => {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultData;
  }
};

const saveToStorage = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Initialize data
const initializeData = () => {
  if (!sessionStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, mockUsers);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.ROLES)) {
    saveToStorage(STORAGE_KEYS.ROLES, mockRoles);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    saveToStorage(STORAGE_KEYS.CUSTOMERS, mockCustomers);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.ROOM_TYPES)) {
    saveToStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.ROOMS)) {
    saveToStorage(STORAGE_KEYS.ROOMS, mockRooms);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    saveToStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.SERVICES)) {
    saveToStorage(STORAGE_KEYS.SERVICES, mockServices);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    saveToStorage(STORAGE_KEYS.INVENTORY, mockInventory);
  }
  if (!sessionStorage.getItem(STORAGE_KEYS.INVOICES)) {
    saveToStorage(STORAGE_KEYS.INVOICES, mockInvoices);
  }
};

initializeData();

// Session Data Manager Class
class SessionDataManager {
  // Authentication
  static async login(credentials) {
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    const user = users.find(u => 
      (u.email === credentials.email || u.username === credentials.username) && 
      u.password === credentials.password
    );
    
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      return { data: { user: userWithoutPassword, token: 'mock-jwt-token' } };
    }
    throw new Error('Invalid username or password');
  }

  // Services CRUD
  static async getServices() {
    const services = loadFromStorage(STORAGE_KEYS.SERVICES, mockServices);
    return { data: services };
  }

  static async getService(id) {
    const services = loadFromStorage(STORAGE_KEYS.SERVICES, mockServices);
    const service = services.find(s => s.id === parseInt(id));
    if (!service) throw new Error('Service not found');
    return { data: service };
  }

  static async createService(serviceData) {
    const services = loadFromStorage(STORAGE_KEYS.SERVICES, mockServices);
    const newService = {
      id: Math.max(...services.map(s => s.id), 0) + 1,
      ...serviceData,
      createdAt: new Date().toISOString()
    };
    services.push(newService);
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return { data: newService };
  }

  static async updateService(id, serviceData) {
    const services = loadFromStorage(STORAGE_KEYS.SERVICES, mockServices);
    const index = services.findIndex(s => s.id === parseInt(id));
    if (index === -1) throw new Error('Service not found');
    
    services[index] = { ...services[index], ...serviceData, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return { data: services[index] };
  }

  static async deleteService(id) {
    const services = loadFromStorage(STORAGE_KEYS.SERVICES, mockServices);
    const filteredServices = services.filter(s => s.id !== parseInt(id));
    if (services.length === filteredServices.length) {
      throw new Error('Service not found');
    }
    saveToStorage(STORAGE_KEYS.SERVICES, filteredServices);
    return { success: true };
  }

  // Bookings CRUD
  static async getBookings() {
    const bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    return { data: bookings };
  }

  static async getBooking(id) {
    const bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    const booking = bookings.find(b => b.id === parseInt(id));
    if (!booking) throw new Error('Booking not found');
    return { data: booking };
  }

  static async createBooking(bookingData) {
    const bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    const newBooking = {
      id: Math.max(...bookings.map(b => b.id), 0) + 1,
      ...bookingData,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return { data: newBooking };
  }

  static async updateBooking(id, bookingData) {
    const bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    const index = bookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) throw new Error('Booking not found');
    
    bookings[index] = { ...bookings[index], ...bookingData, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return { data: bookings[index] };
  }

  static async deleteBooking(id) {
    const bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    const filteredBookings = bookings.filter(b => b.id !== parseInt(id));
    if (bookings.length === filteredBookings.length) {
      throw new Error('Booking not found');
    }
    saveToStorage(STORAGE_KEYS.BOOKINGS, filteredBookings);
    return { success: true };
  }

  // Invoices CRUD
  static async getInvoices() {
    const invoices = loadFromStorage(STORAGE_KEYS.INVOICES, mockInvoices);
    return { data: invoices };
  }

  static async getInvoice(id) {
    const invoices = loadFromStorage(STORAGE_KEYS.INVOICES, mockInvoices);
    const invoice = invoices.find(i => i.id === parseInt(id));
    if (!invoice) throw new Error('Invoice not found');
    return { data: invoice };
  }

  static async createInvoice(invoiceData) {
    const invoices = loadFromStorage(STORAGE_KEYS.INVOICES, mockInvoices);
    const newInvoice = {
      id: Math.max(...invoices.map(i => i.id), 0) + 1,
      invoiceId: Math.max(...invoices.map(i => i.invoiceId || 0), 0) + 1,
      ...invoiceData,
      createdAt: new Date().toISOString()
    };
    invoices.push(newInvoice);
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
    return { data: newInvoice };
  }

  static async updateInvoice(id, invoiceData) {
    const invoices = loadFromStorage(STORAGE_KEYS.INVOICES, mockInvoices);
    const index = invoices.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Invoice not found');
    
    invoices[index] = { ...invoices[index], ...invoiceData, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
    return { data: invoices[index] };
  }

  static async deleteInvoice(id) {
    const invoices = loadFromStorage(STORAGE_KEYS.INVOICES, mockInvoices);
    const filteredInvoices = invoices.filter(i => i.id !== parseInt(id));
    if (invoices.length === filteredInvoices.length) {
      throw new Error('Invoice not found');
    }
    saveToStorage(STORAGE_KEYS.INVOICES, filteredInvoices);
    return { success: true };
  }

  // Inventory CRUD
  static async getInventory() {
    const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY, mockInventory);
    return { data: inventory };
  }

  static async getInventoryItem(id) {
    const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY, mockInventory);
    const item = inventory.find(i => i.id === parseInt(id));
    if (!item) throw new Error('Inventory item not found');
    return { data: item };
  }

  static async createInventoryItem(itemData) {
    const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY, mockInventory);
    const newItem = {
      id: Math.max(...inventory.map(i => i.id), 0) + 1,
      ...itemData,
      createdAt: new Date().toISOString()
    };
    inventory.push(newItem);
    saveToStorage(STORAGE_KEYS.INVENTORY, inventory);
    return { data: newItem };
  }

  static async updateInventoryItem(id, itemData) {
    const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY, mockInventory);
    const index = inventory.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Inventory item not found');
    
    inventory[index] = { ...inventory[index], ...itemData, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.INVENTORY, inventory);
    return { data: inventory[index] };
  }

  static async deleteInventoryItem(id) {
    const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY, mockInventory);
    const filteredInventory = inventory.filter(i => i.id !== parseInt(id));
    if (inventory.length === filteredInventory.length) {
      throw new Error('Inventory item not found');
    }
    saveToStorage(STORAGE_KEYS.INVENTORY, filteredInventory);
    return { success: true };
  }

  static async getCurrentUser() {
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    const user = users[0];
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      return { data: userWithoutPassword };
    }
    throw new Error('User not found');
  }

  // Users/Accounts
  static async getUsers(params = {}) {
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    return { data: usersWithoutPasswords };
  }

  static async getUserById(id) {
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    const user = users.find(u => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return { data: userWithoutPassword };
    }
    throw new Error('User not found');
  }

  static async createUser(userData) {
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    
    const { password, ...userWithoutPassword } = newUser;
    return { data: userWithoutPassword };
  }

  static async updateUser(id, userData) {
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) throw new Error('User not found');

    if (userData.email && users.some(u => u.email === userData.email && u.id !== id)) {
      throw new Error('Email already exists');
    }

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    };

    saveToStorage(STORAGE_KEYS.USERS, users);
    
    const { password, ...userWithoutPassword } = users[index];
    return { data: userWithoutPassword };
  }

  static async deleteUser(id) {
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) throw new Error('User not found');
    
    users.splice(index, 1);
    saveToStorage(STORAGE_KEYS.USERS, users);
    
    return { data: { message: 'User deleted successfully' } };
  }

  // Roles
  static async getRoles() {
    const roles = loadFromStorage(STORAGE_KEYS.ROLES, mockRoles);
    return { data: roles };
  }

  static async getRoleById(id) {
    const roles = loadFromStorage(STORAGE_KEYS.ROLES, mockRoles);
    const role = roles.find(r => r.id === id);
    if (!role) throw new Error('Role not found');
    return { data: role };
  }

  static async createRole(roleData) {
    const roles = loadFromStorage(STORAGE_KEYS.ROLES, mockRoles);
    
    if (roles.some(r => r.name === roleData.name)) {
      throw new Error('Role name already exists');
    }

    const newRole = {
      id: Date.now(),
      ...roleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    roles.push(newRole);
    saveToStorage(STORAGE_KEYS.ROLES, roles);
    
    return { data: newRole };
  }

  static async updateRole(id, roleData) {
    const roles = loadFromStorage(STORAGE_KEYS.ROLES, mockRoles);
    const index = roles.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('Role not found');

    if (roleData.name && roles.some(r => r.name === roleData.name && r.id !== id)) {
      throw new Error('Role name already exists');
    }

    roles[index] = {
      ...roles[index],
      ...roleData,
      updatedAt: new Date().toISOString()
    };

    saveToStorage(STORAGE_KEYS.ROLES, roles);
    return { data: roles[index] };
  }

  static async deleteRole(id) {
    const roles = loadFromStorage(STORAGE_KEYS.ROLES, mockRoles);
    const users = loadFromStorage(STORAGE_KEYS.USERS, mockUsers);
    
    if (users.some(u => u.roleId === id)) {
      throw new Error('Cannot delete role that is assigned to users');
    }
    
    const index = roles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    
    roles.splice(index, 1);
    saveToStorage(STORAGE_KEYS.ROLES, roles);
    
    return { data: { message: 'Role deleted successfully' } };
  }

  // Customers
  static async getCustomers(params = {}) {
    const customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    return { data: customers };
  }

  static async getCustomerById(id) {
    const customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    const customer = customers.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return { data: customer };
  }

  static async createCustomer(customerData) {
    const customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    
    if (customers.some(c => c.email === customerData.email)) {
      throw new Error('Email already exists');
    }

    if (customers.some(c => c.phone === customerData.phone)) {
      throw new Error('Phone number already exists');
    }

    const newCustomer = {
      id: Date.now(),
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    customers.push(newCustomer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    
    return { data: newCustomer };
  }

  static async updateCustomer(id, customerData) {
    const customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    const index = customers.findIndex(c => c.id === id);
    
    if (index === -1) throw new Error('Customer not found');

    if (customerData.email && customers.some(c => c.email === customerData.email && c.id !== id)) {
      throw new Error('Email already exists');
    }

    if (customerData.phone && customers.some(c => c.phone === customerData.phone && c.id !== id)) {
      throw new Error('Phone number already exists');
    }

    customers[index] = {
      ...customers[index],
      ...customerData,
      updatedAt: new Date().toISOString()
    };

    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return { data: customers[index] };
  }

  static async deleteCustomer(id) {
    const customers = loadFromStorage(STORAGE_KEYS.CUSTOMERS, mockCustomers);
    const bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    
    if (bookings.some(b => b.customerId === id && b.status === 'confirmed')) {
      throw new Error('Cannot delete customer with active bookings');
    }
    
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    
    customers.splice(index, 1);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    
    return { data: { message: 'Customer deleted successfully' } };
  }

  // Room Types
  static async getRoomTypes(params = {}) {
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    const rooms = loadFromStorage(STORAGE_KEYS.ROOMS, mockRooms);
    
    const roomTypesWithCounts = roomTypes.map(roomType => {
      const typeRooms = rooms.filter(room => room.roomTypeId === roomType.id);
      const availableRooms = typeRooms.filter(room => room.status === 'available').length;
      
      return {
        ...roomType,
        roomCount: typeRooms.length,
        availableRooms
      };
    });
    
    return { data: roomTypesWithCounts };
  }

  static async getRoomTypeById(id) {
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    const roomType = roomTypes.find(rt => rt.id === id);
    if (!roomType) throw new Error('Room type not found');
    return { data: roomType };
  }

  static async createRoomType(roomTypeData) {
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    
    if (roomTypes.some(rt => rt.name === roomTypeData.name)) {
      throw new Error('Room type name already exists');
    }

    const newRoomType = {
      id: Date.now(),
      ...roomTypeData,
      roomCount: 0,
      availableRooms: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    roomTypes.push(newRoomType);
    saveToStorage(STORAGE_KEYS.ROOM_TYPES, roomTypes);
    
    return { data: newRoomType };
  }

  static async updateRoomType(id, roomTypeData) {
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    const index = roomTypes.findIndex(rt => rt.id === id);
    
    if (index === -1) throw new Error('Room type not found');

    if (roomTypeData.name && roomTypes.some(rt => rt.name === roomTypeData.name && rt.id !== id)) {
      throw new Error('Room type name already exists');
    }

    roomTypes[index] = {
      ...roomTypes[index],
      ...roomTypeData,
      updatedAt: new Date().toISOString()
    };

    saveToStorage(STORAGE_KEYS.ROOM_TYPES, roomTypes);
    return { data: roomTypes[index] };
  }

  static async deleteRoomType(id) {
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    const rooms = loadFromStorage(STORAGE_KEYS.ROOMS, mockRooms);
    
    if (rooms.some(r => r.roomTypeId === id)) {
      throw new Error('Cannot delete room type with existing rooms');
    }
    
    const index = roomTypes.findIndex(rt => rt.id === id);
    if (index === -1) throw new Error('Room type not found');
    
    roomTypes.splice(index, 1);
    saveToStorage(STORAGE_KEYS.ROOM_TYPES, roomTypes);
    
    return { data: { message: 'Room type deleted successfully' } };
  }

  // Rooms
  static async getRooms(params = {}) {
    const rooms = loadFromStorage(STORAGE_KEYS.ROOMS, mockRooms);
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    
    const roomsWithDetails = rooms.map(room => {
      const roomType = roomTypes.find(rt => rt.id === room.roomTypeId);
      return {
        ...room,
        roomType: roomType || null
      };
    });
    
    return { data: roomsWithDetails };
  }

  static async getRoomById(id) {
    const rooms = loadFromStorage(STORAGE_KEYS.ROOMS, mockRooms);
    const room = rooms.find(r => r.id === id);
    if (!room) throw new Error('Room not found');
    return { data: room };
  }

  static async createRoom(roomData) {
    const rooms = loadFromStorage(STORAGE_KEYS.ROOMS, mockRooms);
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    
    if (rooms.some(r => r.roomNumber === roomData.roomNumber)) {
      throw new Error('Room number already exists');
    }

    if (!roomTypes.some(rt => rt.id === roomData.roomTypeId)) {
      throw new Error('Room type not found');
    }

    const newRoom = {
      id: Date.now(),
      ...roomData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    rooms.push(newRoom);
    saveToStorage(STORAGE_KEYS.ROOMS, rooms);
    
    return { data: newRoom };
  }

  static async updateRoom(id, roomData) {
    const rooms = loadFromStorage(STORAGE_KEYS.ROOMS, mockRooms);
    const roomTypes = loadFromStorage(STORAGE_KEYS.ROOM_TYPES, mockRoomTypes);
    const index = rooms.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('Room not found');

    if (roomData.roomNumber && rooms.some(r => r.roomNumber === roomData.roomNumber && r.id !== id)) {
      throw new Error('Room number already exists');
    }

    if (roomData.roomTypeId && !roomTypes.some(rt => rt.id === roomData.roomTypeId)) {
      throw new Error('Room type not found');
    }

    rooms[index] = {
      ...rooms[index],
      ...roomData,
      updatedAt: new Date().toISOString()
    };

    saveToStorage(STORAGE_KEYS.ROOMS, rooms);
    return { data: rooms[index] };
  }

  static async deleteRoom(id) {
    const rooms = loadFromStorage(STORAGE_KEYS.ROOMS, mockRooms);
    const bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    
    if (bookings.some(b => b.roomId === id && b.status === 'confirmed')) {
      throw new Error('Cannot delete room with active bookings');
    }
    
    const index = rooms.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Room not found');
    
    rooms.splice(index, 1);
    saveToStorage(STORAGE_KEYS.ROOMS, rooms);
    
    return { data: { message: 'Room deleted successfully' } };
  }

  // Dashboard
  static async getDashboardStats() {
    return { data: mockDashboardStats };
  }

  static async getRevenueData() {
    return { data: mockRevenueData };
  }

  static async getOccupancyData() {
    return { data: mockOccupancyData };
  }

  static async getRoomTypeData() {
    return { data: mockRoomTypeData };
  }

  static async getRecentBookings() {
    return { data: mockRecentBookings };
  }

  // Reports
  static async getReportsData(params = {}) {
    return { data: mockReportsData };
  }

  // Utility
  static clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
    initializeData();
  }
}

export default SessionDataManager;
