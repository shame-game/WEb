import SessionDataManager from '../data/sessionDataManager';

// Auth service
export const authService = {
  login: async (credentials) => {
    try {
      const response = await SessionDataManager.login(credentials);
      return {
        token: response.data.token,
        user: response.data.user
      };
    } catch (error) {
      throw new Error('Invalid username or password');
    }
  },
  
  logout: () => {
    localStorage.removeItem('hotel_auth_token');
    localStorage.removeItem('hotel_user_info');
  }
};

// Dashboard service
export const dashboardService = {
  getStats: async () => {
    return await SessionDataManager.getDashboardStats();
  },
  getRevenueData: async () => {
    return await SessionDataManager.getRevenueData();
  },
  getOccupancyData: async () => {
    return await SessionDataManager.getOccupancyData();
  },
  getRoomTypeData: async () => {
    return await SessionDataManager.getRoomTypeData();
  },
  getRecentBookings: async () => {
    return await SessionDataManager.getRecentBookings();
  }
};

// Account service
export const accountService = {
  getAll: async () => {
    return await SessionDataManager.getUsers();
  },
  getById: async (id) => {
    return await SessionDataManager.getUserById(id);
  },
  create: async (data) => {
    return await SessionDataManager.createUser(data);
  },
  update: async (id, data) => {
    return await SessionDataManager.updateUser(id, data);
  },
  delete: async (id) => {
    return await SessionDataManager.deleteUser(id);
  }
};

// Role service
export const roleService = {
  getAll: async () => {
    return await SessionDataManager.getRoles();
  },
  getById: async (id) => {
    return await SessionDataManager.getRoleById(id);
  },
  create: async (data) => {
    return await SessionDataManager.createRole(data);
  },
  update: async (id, data) => {
    return await SessionDataManager.updateRole(id, data);
  },
  delete: async (id) => {
    return await SessionDataManager.deleteRole(id);
  }
};

// Customer service
export const customerService = {
  getAll: async (params) => {
    return await SessionDataManager.getCustomers(params);
  },
  getById: async (id) => {
    return await SessionDataManager.getCustomerById(id);
  },
  create: async (data) => {
    return await SessionDataManager.createCustomer(data);
  },
  update: async (id, data) => {
    return await SessionDataManager.updateCustomer(id, data);
  },
  delete: async (id) => {
    return await SessionDataManager.deleteCustomer(id);
  }
};

// Room Type service
export const roomTypeService = {
  getAll: async () => {
    return await SessionDataManager.getRoomTypes();
  },
  getById: async (id) => {
    return await SessionDataManager.getRoomTypeById(id);
  },
  create: async (data) => {
    return await SessionDataManager.createRoomType(data);
  },
  update: async (id, data) => {
    return await SessionDataManager.updateRoomType(id, data);
  },
  delete: async (id) => {
    return await SessionDataManager.deleteRoomType(id);
  },
  // Alias methods for backward compatibility
  createRoomType: async (roomTypeData) => {
    return await SessionDataManager.createRoomType(roomTypeData);
  },
  deleteRoomType: async (roomTypeId) => {
    return await SessionDataManager.deleteRoomType(roomTypeId);
  }
};

// Room service
export const roomService = {
  getAll: async (params) => {
    return await SessionDataManager.getRooms(params);
  },
  getById: async (id) => {
    return await SessionDataManager.getRoomById(id);
  },
  create: async (data) => {
    return await SessionDataManager.createRoom(data);
  },
  update: async (id, data) => {
    return await SessionDataManager.updateRoom(id, data);
  },
  delete: async (id) => {
    return await SessionDataManager.deleteRoom(id);
  },
  // Alias method for backward compatibility
  createRoom: async (roomData) => {
    return await SessionDataManager.createRoom(roomData);
  }
};

// Service service
export const serviceService = {
  getAll: async () => {
    await delay();
    return mockApiResponse(mockServices);
  },
  getById: async (id) => {
    await delay();
    const service = mockServices.find(s => s.id === parseInt(id));
    if (!service) throw new Error('Service not found');
    return mockApiResponse(service);
  },
  create: async (data) => {
    await delay();
    const newService = {
      id: Math.max(...mockServices.map(s => s.id)) + 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    mockServices.push(newService);
    return mockApiResponse(newService);
  },
  update: async (id, data) => {
    await delay();
    const index = mockServices.findIndex(s => s.id === parseInt(id));
    if (index === -1) throw new Error('Service not found');
    mockServices[index] = { ...mockServices[index], ...data };
    return mockApiResponse(mockServices[index]);
  },
  delete: async (id) => {
    await delay();
    const index = mockServices.findIndex(s => s.id === parseInt(id));
    if (index === -1) throw new Error('Service not found');
    mockServices.splice(index, 1);
    return mockApiResponse({ success: true });
  }
};

// Booking service
export const bookingService = {
  createBooking: async (bookingData) => {
    return api.post('/Booking', bookingData);
  },
  getBookings: async () => {
    return api.get('/Booking');
  },
  updateBooking: async (bookingId, bookingData) => {
    return api.put(`/Booking/${bookingId}`, bookingData);
  },
  deleteBooking: async (bookingId) => {
    return api.delete(`/Booking/${bookingId}`);
  },
  getAll: async (params) => {
    await delay();
    let filteredBookings = [...mockBookings];
    
    // Filter by status
    if (params?.status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === params.status);
    }
    
    // Filter by date range
    if (params?.startDate && params?.endDate) {
      filteredBookings = filteredBookings.filter(booking => {
        const checkIn = new Date(booking.checkInDate);
        const start = new Date(params.startDate);
        const end = new Date(params.endDate);
        return checkIn >= start && checkIn <= end;
      });
    }
    
    return mockApiResponse(filteredBookings);
  },
  getById: async (id) => {
    await delay();
    const booking = mockBookings.find(b => b.id === parseInt(id));
    if (!booking) throw new Error('Booking not found');
    return mockApiResponse(booking);
  },
  create: async (data) => {
    await delay();
    const newBooking = {
      id: Math.max(...mockBookings.map(b => b.id)) + 1,
      ...data,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };
    mockBookings.push(newBooking);
    return mockApiResponse(newBooking);
  },
  update: async (id, data) => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) throw new Error('Booking not found');
    mockBookings[index] = { ...mockBookings[index], ...data };
    return mockApiResponse(mockBookings[index]);
  },
  delete: async (id) => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) throw new Error('Booking not found');
    mockBookings.splice(index, 1);
    return mockApiResponse({ success: true });
  },
  checkIn: async (id) => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) throw new Error('Booking not found');
    mockBookings[index].status = 'checked_in';
    mockBookings[index].actualCheckInDate = new Date().toISOString();
    return mockApiResponse(mockBookings[index]);
  },
  checkOut: async (id) => {
    await delay();
    const index = mockBookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) throw new Error('Booking not found');
    mockBookings[index].status = 'checked_out';
    mockBookings[index].actualCheckOutDate = new Date().toISOString();
    return mockApiResponse(mockBookings[index]);
  }
};

// Booking Service service
export const bookingServiceService = {
  create: async (data) => {
    await delay();
    // This would typically handle adding services to bookings
    return mockApiResponse({ success: true, data });
  },
  delete: async (bookingId, serviceId) => {
    await delay();
    // This would typically handle removing services from bookings
    return mockApiResponse({ success: true });
  }
};

// Invoice service
export const invoiceService = {
  getAll: async (params) => {
    await delay();
    let filteredInvoices = [...mockInvoices];
    
    // Filter by status
    if (params?.status) {
      filteredInvoices = filteredInvoices.filter(invoice => invoice.status === params.status);
    }
    
    // Filter by date range
    if (params?.startDate && params?.endDate) {
      filteredInvoices = filteredInvoices.filter(invoice => {
        const invoiceDate = new Date(invoice.issueDate);
        const start = new Date(params.startDate);
        const end = new Date(params.endDate);
        return invoiceDate >= start && invoiceDate <= end;
      });
    }
    
    return mockApiResponse(filteredInvoices);
  },
  getById: async (id) => {
    await delay();
    const invoice = mockInvoices.find(i => i.id === parseInt(id));
    if (!invoice) throw new Error('Invoice not found');
    return mockApiResponse(invoice);
  },
  create: async (data) => {
    await delay();
    const newInvoice = {
      id: Math.max(...mockInvoices.map(i => i.id)) + 1,
      ...data,
      issueDate: new Date().toISOString(),
      status: 'pending'
    };
    mockInvoices.push(newInvoice);
    return mockApiResponse(newInvoice);
  },
  update: async (id, data) => {
    await delay();
    const index = mockInvoices.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Invoice not found');
    mockInvoices[index] = { ...mockInvoices[index], ...data };
    return mockApiResponse(mockInvoices[index]);
  },
  delete: async (id) => {
    await delay();
    const index = mockInvoices.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Invoice not found');
    mockInvoices.splice(index, 1);
    return mockApiResponse({ success: true });
  }
};

// Payment service
export const paymentService = {
  create: async (data) => {
    await delay();
    const newPayment = {
      id: Math.max(...mockInvoices.map(i => i.id)) + 1,
      ...data,
      paymentDate: new Date().toISOString(),
      status: 'completed'
    };
    // Update invoice status to paid if full payment
    const invoice = mockInvoices.find(i => i.id === data.invoiceId);
    if (invoice && data.amount >= invoice.totalAmount) {
      invoice.status = 'paid';
      invoice.paidDate = new Date().toISOString();
    }
    return mockApiResponse(newPayment);
  },
  getByInvoiceId: async (invoiceId) => {
    await delay();
    // Mock payment data for the invoice
    const payments = [
      {
        id: 1,
        invoiceId: parseInt(invoiceId),
        amount: 1000000,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString(),
        status: 'completed'
      }
    ];
    return mockApiResponse(payments);
  }
};

// Inventory service
export const inventoryService = {
  getAll: async () => {
    await delay();
    return mockApiResponse(mockInventory);
  },
  getById: async (id) => {
    await delay();
    const item = mockInventory.find(i => i.id === parseInt(id));
    if (!item) throw new Error('Inventory item not found');
    return mockApiResponse(item);
  },
  create: async (data) => {
    await delay();
    const newItem = {
      id: Math.max(...mockInventory.map(i => i.id)) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    mockInventory.push(newItem);
    return mockApiResponse(newItem);
  },
  update: async (id, data) => {
    await delay();
    const index = mockInventory.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Inventory item not found');
    mockInventory[index] = { 
      ...mockInventory[index], 
      ...data, 
      lastUpdated: new Date().toISOString() 
    };
    return mockApiResponse(mockInventory[index]);
  },
  delete: async (id) => {
    await delay();
    const index = mockInventory.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Inventory item not found');
    mockInventory.splice(index, 1);
    return mockApiResponse({ success: true });
  },
  adjustStock: async (id, adjustmentData) => {
    await delay();
    const index = mockInventory.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Inventory item not found');
    
    const item = mockInventory[index];
    const newQuantity = item.currentStock + adjustmentData.quantity;
    
    if (newQuantity < 0) {
      throw new Error('Insufficient stock');
    }
    
    mockInventory[index] = {
      ...item,
      currentStock: newQuantity,
      lastUpdated: new Date().toISOString()
    };
    
    return mockApiResponse({
      success: true,
      item: mockInventory[index],
      adjustment: adjustmentData
    });  }
};
