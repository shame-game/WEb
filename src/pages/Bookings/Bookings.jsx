import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar, User, Bed, Filter, FileText, Download } from 'lucide-react';
import BookingForm from './BookingForm';
import InvoicePreview from './InvoicePreview';
import DataGrid from '../../components/UI/DataGrid';
import Modal from '../../components/UI/Modal';
import StatusBadge from '../../components/UI/StatusBadge';
import ResultPopup from '../../components/UI/ResultPopup';
import styles from './Bookings.module.css';
import { mockBookings, mockRoomTypes, mockRooms, mockCustomers, mockInvoices } from '../../data/mockData';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAddRoomTypeModalOpen, setIsAddRoomTypeModalOpen] = useState(false);
  const [resultPopup, setResultPopup] = useState({ show: false, type: '', message: '' });  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [invoices, setInvoices] = useState([]);
  // Load initial data from APIs
  useEffect(() => {
    loadBookings();
    loadRooms();
    loadCustomers();
    loadRoomTypes();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // For now, use mock data since no Booking API is available
      const transformedBookings = mockBookings.map(booking => ({
        bookingId: booking.id,
        customerId: booking.customerId,
        roomId: booking.roomId,
        checkInTime: booking.checkInDate + 'T14:00:00',
        checkOutTime: booking.checkOutDate + 'T12:00:00',
        status: booking.status,
        customer: {
          customerId: booking.customerId,
          name: booking.customerName
        },
        room: {
          roomId: booking.roomId,
          roomNumber: booking.roomNumber,
          roomTypeName: booking.roomTypeName
        },
        totalAmount: booking.totalAmount,
        specialRequests: booking.specialRequests
      }));
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const response = await fetch('https://quanlyks.onrender.com/api/Room');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRooms(data || []);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      // Fallback to mock data
      const transformedRooms = mockRooms.map(room => ({
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId,
        roomType: room.roomTypeName,
        price: room.price,
        status: room.status
      }));
      setRooms(transformedRooms);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetch('https://quanlyks.onrender.com/api/Customer');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCustomers(data || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
      // Fallback to mock data
      const transformedCustomers = mockCustomers.map(customer => ({
        customerId: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phone,
        address: customer.address
      }));
      setCustomers(transformedCustomers);
    }
  };

  const loadRoomTypes = async () => {
    try {
      const response = await fetch('https://quanlyks.onrender.com/api/RoomType');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRoomTypes(data || []);
    } catch (error) {
      console.error('Failed to load room types:', error);
      // Fallback to mock data
      const transformedRoomTypes = mockRoomTypes.map(type => ({
        roomTypeId: type.id,
        roomTypeName: type.name,
        description: type.description,
        basePrice: type.basePrice
      }));
      setRoomTypes(transformedRoomTypes);
    }  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedBooking) {
        // Update existing booking - API not implemented
        alert('Chức năng cập nhật đặt phòng chưa được triển khai trên API');
      } else {
        // Create new booking - API not implemented
        alert('Chức năng tạo đặt phòng mới chưa được triển khai trên API');
      }
      
      setShowModal(false);
      setSelectedBooking(null);
      // Reload bookings if API was implemented
      // await loadBookings();
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert('Đã xảy ra lỗi khi xử lý đặt phòng.');
    }
  };const handleDelete = (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt phòng này không?')) {
      setLoading(true);
      
      try {
        setBookings(prev => prev.filter(booking => booking.bookingId !== bookingId));
        setResultPopup({ 
          show: true, 
          type: 'success', 
          message: 'Đặt phòng đã được xóa thành công!' 
        });
      } catch (error) {
        setResultPopup({ 
          show: true, 
          type: 'error', 
          message: 'Đã xảy ra lỗi khi xóa đặt phòng.' 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreate = () => {
    setSelectedBooking(null);
    setShowModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };
  const handleAddRoom = (roomData) => {
    setLoading(true);
    
    try {
      const newRoom = {
        roomId: Math.max(...rooms.map(r => r.roomId), 0) + 1,
        roomNumber: roomData.roomNumber,
        roomTypeId: parseInt(roomData.roomTypeId, 10),
        roomTypeName: roomTypes.find(rt => rt.roomTypeId === parseInt(roomData.roomTypeId, 10))?.roomTypeName || '',
        price: parseFloat(roomData.price),
        status: 'available',
        floor: parseInt(roomData.floor) || 1,
        description: roomData.description || ''
      };

      setRooms(prev => [...prev, newRoom]);      setResultPopup({
        show: true, 
        type: 'success', 
        message: 'Phòng đã được thêm thành công!' 
      });
      setIsAddRoomModalOpen(false);
    } catch (error) {
      setResultPopup({ 
        show: true, 
        type: 'error', 
        message: 'Đã xảy ra lỗi khi thêm phòng.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoomType = (roomTypeData) => {
    setLoading(true);
    
    try {
      const newRoomType = {
        roomTypeId: Math.max(...roomTypes.map(rt => rt.roomTypeId), 0) + 1,
        roomTypeName: roomTypeData.roomTypeName,
        description: roomTypeData.description || '',
        basePrice: parseFloat(roomTypeData.basePrice) || 0,
        maxOccupancy: parseInt(roomTypeData.maxOccupancy) || 2
      };

      setRoomTypes(prev => [...prev, newRoomType]);      setResultPopup({ 
        show: true, 
        type: 'success', 
        message: 'Loại phòng đã được tạo thành công!' 
      });
      setIsAddRoomTypeModalOpen(false);
    } catch (error) {
      setResultPopup({ 
        show: true, 
        type: 'error', 
        message: 'Đã xảy ra lỗi khi thêm loại phòng.' 
      });
    } finally {
      setLoading(false);
    }
  };
  const handleExportInvoice = (booking) => {
    // Calculate invoice details
    const checkInDate = new Date(booking.checkInTime);
    const checkOutDate = new Date(booking.checkOutTime);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const room = rooms.find(r => r.roomId === booking.roomId);
    const roomPrice = room?.price || 0;
    const subtotal = roomPrice * nights;
    const taxRate = 0.1; // 10% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Generate invoice data
    const invoice = {
      invoiceId: Math.max(...invoices.map(inv => inv.invoiceId), 0) + 1,
      bookingId: booking.bookingId,
      customerName: booking.customer?.name || `Khách hàng ID: ${booking.customerId}`,
      roomNumber: booking.room?.roomNumber || `Phòng ID: ${booking.roomId}`,
      roomType: booking.room?.roomTypeName || '',
      checkInDate: checkInDate.toLocaleDateString('vi-VN'),
      checkOutDate: checkOutDate.toLocaleDateString('vi-VN'),
      nights: nights,
      roomPrice: roomPrice,
      subtotal: subtotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      status: 'PENDING',
      issueDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'), // 7 days from now
      items: [
        { 
          description: `Phòng ${booking.room?.roomNumber} - ${booking.room?.roomTypeName} (${nights} đêm)`, 
          amount: subtotal 
        },
        { 
          description: 'Thuế (10%)', 
          amount: taxAmount 
        }
      ]
    };

    setInvoiceData(invoice);
    setShowInvoicePreview(true);
  };

  const handleSaveInvoice = (invoice) => {
    // Add invoice to invoices list
    const newInvoice = {
      ...invoice,
      id: Math.max(...invoices.map(inv => inv.id || 0), 0) + 1,
      paidAmount: 0,
      paymentMethod: null
    };
    
    setInvoices(prev => [...prev, newInvoice]);
    
    // Update booking to mark as invoiced
    setBookings(prev => prev.map(booking => 
      booking.bookingId === invoice.bookingId 
        ? { ...booking, hasInvoice: true, invoiceId: invoice.invoiceId }
        : booking
    ));

    setResultPopup({
      show: true,
      type: 'success',
      message: 'Hóa đơn đã được tạo và lưu thành công!'
    });

    setShowInvoicePreview(false);
  };

  // Filter and search logic
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toString().includes(searchTerm);
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });  // DataGrid columns configuration
  const columns = [
    {
      key: 'bookingId',
      header: 'Mã đặt phòng',
      width: '80px',
      render: (booking) => `#${booking.bookingId}`
    },
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (booking) => (
        <div className={styles.customerInfo}>
          <div className={styles.customerName}>
            {booking.customer?.name || `Mã KH: ${booking.customerId}`}
          </div>
        </div>
      )
    },
    {
      key: 'room',
      header: 'Phòng',
      render: (booking) => (
        <div className={styles.roomInfo}>
          <div className={styles.roomNumber}>
            <Bed size={16} />
            {booking.room?.roomNumber || `Mã phòng: ${booking.roomId}`}
          </div>
          <div className={styles.roomType}>
            {booking.room?.roomTypeName}
          </div>
        </div>
      )
    },
    {
      key: 'dates',
      header: 'Ngày nhận / Trả phòng',
      render: (booking) => (
        <div className={styles.dateInfo}>
          <div className={styles.checkIn}>
            <Calendar size={14} />
            {new Date(booking.checkInTime).toLocaleDateString('vi-VN')}
          </div>
          <div className={styles.checkOut}>
            <Calendar size={14} />
            {new Date(booking.checkOutTime).toLocaleDateString('vi-VN')}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '120px',
      render: (booking) => (
        <StatusBadge 
          status={booking.status} 
          variant={getStatusVariant(booking.status)}
        />
      )
    },
    {
      key: 'totalAmount',
      header: 'Tổng tiền',
      width: '100px',
      render: (booking) => 
        booking.totalAmount ? `${booking.totalAmount.toLocaleString('vi-VN')} VNĐ` : '-'    }
  ];

  // Actions for DataGrid
  const actions = [
    {
      icon: Edit2,
      label: 'Sửa',
      onClick: handleEdit,
      condition: (booking) => !booking.hasInvoice
    },
    {
      icon: Trash2,
      label: 'Xóa',
      onClick: (booking) => handleDelete(booking.bookingId),
      className: styles.deleteAction,
      condition: (booking) => !booking.hasInvoice
    },
    {
      icon: FileText,
      label: 'Xuất hóa đơn',
      onClick: handleExportInvoice,
      condition: (booking) => !booking.hasInvoice
    }
  ];

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'checked_in': return 'info';
      case 'checked_out': return 'secondary';
      case 'cancelled': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };
  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'checked_in', label: 'Đã nhận phòng' },
    { value: 'checked_out', label: 'Đã trả phòng' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'pending', label: 'Chờ xử lý' }
  ];

  return (
    <div className={styles.container}>
      <ResultPopup 
        show={resultPopup.show}
        onClose={() => setResultPopup({ show: false, type: '', message: '' })}
        type={resultPopup.type}
        message={resultPopup.message}
      />      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý đặt phòng</h1>
        <div className={styles.headerButtons}>
          <button
            onClick={handleCreate}
            className={styles.addButton}
          >
            <Plus size={18} />
            Thêm đặt phòng mới
          </button>
        </div>
      </div>      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tìm kiếm</label>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo khách hàng, phòng hoặc mã đặt phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.filterInput}
            />
          </div>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Trạng thái</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>{/* Data Grid */}
      <div className={styles.content}>        <DataGrid
          data={filteredBookings}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyMessage="Không tìm thấy đặt phòng nào"
        />
      </div>

      {/* Modals */}
      {showModal && (
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          title={selectedBooking ? 'Chỉnh sửa đặt phòng' : 'Tạo đặt phòng mới'}
        >
          <BookingForm
            onSubmit={handleFormSubmit}
            initialData={selectedBooking ? {
              ...selectedBooking,
              checkInTime: selectedBooking.checkInTime ? new Date(selectedBooking.checkInTime).toISOString().slice(0, 16) : '',
              checkOutTime: selectedBooking.checkOutTime ? new Date(selectedBooking.checkOutTime).toISOString().slice(0, 16) : '',
            } : { checkInTime: new Date().toISOString().slice(0,16) } }
            isLoading={loading}
            onCancel={() => setShowModal(false)}
            roomTypes={roomTypes}
            rooms={rooms}
            customers={customers}
          />
        </Modal>
      )}
      {/* Invoice Preview Modal */}
      {showInvoicePreview && invoiceData && (
        <Modal 
          isOpen={showInvoicePreview} 
          onClose={() => setShowInvoicePreview(false)} 
          title={`Hóa đơn - Đặt phòng #${invoiceData.bookingId}`}
          className={styles.invoiceModal}
        >          <InvoicePreview
            data={invoiceData}
            onClose={() => setShowInvoicePreview(false)}
            onSaveInvoice={handleSaveInvoice}
          />
        </Modal>
      )}
    </div>
  );
};

export default Bookings;