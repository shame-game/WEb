import React, { useEffect, useState, useCallback } from 'react';
import { bookingService, roomService, roomTypeService } from '../../services';
import BookingForm from './BookingForm';
import AddRoomPopup from './AddRoomPopup';
import AddRoomTypePopup from './AddRoomTypePopup';
import styles from './Bookings.module.css';
import { useApi } from '../../hooks/useApi';
import Modal from '../../components/UI/Modal'; // Import Modal
import Button from '../../components/UI/Button'; // Import Button for table actions
import FullScreenLoader from '../../components/UI/FullScreenLoader'; // Import FullScreenLoader
import ResultPopup from '../../components/UI/ResultPopup'; // Import ResultPopup
import { PlusCircle, Edit, Trash2, Home, Layers } from 'lucide-react'; // Icons

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAddRoomTypeModalOpen, setIsAddRoomTypeModalOpen] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [resultPopupInfo, setResultPopupInfo] = useState({ isOpen: false, type: '', message: '' });

  const { 
    data: fetchedBookings,
    loading: loadingBookings,
    error: fetchError,
    callApi: fetchBookingsApi 
  } = useApi(bookingService.getBookings);

  const {
    loading: creatingBooking,
    callApi: createBookingApi
  } = useApi(bookingService.createBooking);

  const {
    loading: updatingBooking,
    callApi: updateBookingApi
  } = useApi(bookingService.updateBooking);
    const {
    loading: deletingBooking,
    callApi: deleteBookingApi
  } = useApi(bookingService.deleteBooking);
  const {
    loading: creatingRoom,
    callApi: createRoomApi
  } = useApi(roomService.createRoom);

  const {
    loading: creatingRoomType,
    callApi: createRoomTypeApi
  } = useApi(roomTypeService.createRoomType);

  const loadBookings = useCallback(async () => {
    try {
      const data = await fetchBookingsApi();
      if (data) setBookings(data);
    } catch (error) {
      setResultPopupInfo({ isOpen: true, type: 'error', title: 'Error Fetching Bookings', message: error.message });
    }
  }, [fetchBookingsApi]);
  useEffect(() => {
    loadBookings();
    loadRoomTypes();
  }, [loadBookings]);
  const loadRoomTypes = useCallback(async () => {
    try {
      const response = await roomTypeService.getAll();
      console.log('Room types response:', response); // Debug log
      // API trả về data trực tiếp hoặc trong response.data
      const roomTypesData = response.data || response;
      setRoomTypes(Array.isArray(roomTypesData) ? roomTypesData : []);
    } catch (error) {
      console.error('Error fetching room types:', error);
      // Fallback data với structure phù hợp
      setRoomTypes([
        { roomTypeId: 1, roomTypeName: 'Standard Room' },
        { roomTypeId: 2, roomTypeName: 'Deluxe Room' },
        { roomTypeId: 3, roomTypeName: 'Suite' }
      ]);
    }
  }, []);

  const handleFormSubmit = async (formData) => {
    // Construct payload with nested structures expected by API
    const payload = {
      bookingId: editingBooking?.bookingId || 0,
      customerId: parseInt(formData.customerId, 10),
      roomId: parseInt(formData.roomId, 10),
      checkInTime: new Date(formData.checkInTime).toISOString(),
      checkOutTime: new Date(formData.checkOutTime).toISOString(),
      status: formData.status,
      Customer: {
        customerId: parseInt(formData.customerId, 10),
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bookings: [],
      },
      Room: {
        roomId: parseInt(formData.roomId, 10),
        roomNumber: formData.roomNumber,
        roomTypeId: parseInt(formData.roomTypeId, 10),
        price: parseFloat(formData.price),
        status: formData.roomStatus,
        RoomType: {
          roomTypeId: parseInt(formData.roomTypeId, 10),
          roomTypeName: formData.roomTypeName,
          rooms: [],
        },
        bookings: [],
      },
      Invoice: {
        invoiceId: editingBooking?.invoice?.invoiceId || 0,
        bookingId: 0,
        totalAmount: parseFloat(formData.totalAmount),
        status: formData.invoiceStatus,
        booking: null,
        payments: [
          {
            paymentId: 0,
            invoiceId: 0,
            paymentMethod: formData.paymentMethod,
            amount: parseFloat(formData.paymentAmount),
            paymentDate: new Date(formData.paymentDate).toISOString(),
            invoice: null,
          },
        ],
      },
      BookingServices: [
        {
          bookingId: 0,
          serviceId: parseInt(formData.serviceId, 10),
          service: {
            serviceId: parseInt(formData.serviceId, 10),
            serviceName: formData.serviceName,
            price: parseFloat(formData.servicePrice),
            bookingServices: [],
          },
          serviceDate: new Date(formData.serviceDate).toISOString(),
          booking: null,
        },
      ],
    };

    try {
      if (editingBooking) {
        await updateBookingApi(editingBooking.bookingId, payload);
        setResultPopupInfo({ isOpen: true, type: 'success', title: 'Booking Updated', message: 'Booking updated successfully!' });
      } else {
        await createBookingApi(payload);
        setResultPopupInfo({ isOpen: true, type: 'success', title: 'Booking Created', message: 'Booking created successfully!' });
      }
      loadBookings();
      closeFormModal();
    } catch (error) {
      setResultPopupInfo({ isOpen: true, type: 'error', title: `Error ${editingBooking ? 'Updating' : 'Creating'} Booking`, message: error.message });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    // Simple confirm, can be replaced with a custom confirmation popup
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBookingApi(bookingId);
        setResultPopupInfo({ isOpen: true, type: 'success', title: 'Booking Deleted', message: 'Booking deleted successfully!' });
        loadBookings(); // Refresh list
      } catch (error) {
        setResultPopupInfo({ isOpen: true, type: 'error', title: 'Error Deleting Booking', message: error.message });
      }
    }
  };

  const openFormModal = (booking = null) => {
    setEditingBooking(booking);
    setIsFormModalOpen(true);
  };
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingBooking(null);
  };

  const openAddRoomModal = () => {
    setIsAddRoomModalOpen(true);
  };
  const closeAddRoomModal = () => {
    setIsAddRoomModalOpen(false);
  };

  const openAddRoomTypeModal = () => {
    setIsAddRoomTypeModalOpen(true);
  };

  const closeAddRoomTypeModal = () => {
    setIsAddRoomTypeModalOpen(false);
  };

  const handleAddRoom = async (roomData) => {
    try {
      await createRoomApi(roomData);
      setResultPopupInfo({ 
        isOpen: true, 
        type: 'success', 
        title: 'Room Added', 
        message: 'Room has been successfully added!' 
      });
      closeAddRoomModal();
    } catch (error) {
      setResultPopupInfo({ 
        isOpen: true, 
        type: 'error', 
        title: 'Error Adding Room', 
        message: error.message 
      });    }
  };

  const handleAddRoomType = async (roomTypeData) => {
    try {
      await createRoomTypeApi(roomTypeData);
      setResultPopupInfo({ 
        isOpen: true, 
        type: 'success', 
        title: 'Room Type Added', 
        message: 'Room type has been successfully created!' 
      });
      closeAddRoomTypeModal();
      loadRoomTypes(); // Reload room types to update the list
    } catch (error) {
      setResultPopupInfo({ 
        isOpen: true, 
        type: 'error', 
        title: 'Error Adding Room Type', 
        message: error.message 
      });
    }
  };

  const closeResultPopup = () => {
    setResultPopupInfo({ isOpen: false, type: '', message: '' });
  };

  const overallLoading = loadingBookings || creatingBooking || updatingBooking || deletingBooking || creatingRoom || creatingRoomType;

  return (
    <div className={styles.bookingsPage}>
      <FullScreenLoader isActive={overallLoading && !isFormModalOpen && !resultPopupInfo.isOpen} />
      <ResultPopup 
        isOpen={resultPopupInfo.isOpen}
        onClose={closeResultPopup}
        type={resultPopupInfo.type}
        title={resultPopupInfo.title}
        message={resultPopupInfo.message}
      />      <header className={styles.header}>
        <h1>Bookings Management</h1>
        <div className={styles.headerButtons}>
          <Button onClick={openAddRoomTypeModal} className={styles.addRoomTypeButton}>
            <Layers size={18} /> Add Room Type
          </Button>
          <Button onClick={openAddRoomModal} className={styles.addRoomButton}>
            <Home size={18} /> Add Room
          </Button>
          <Button onClick={() => openFormModal()} className={styles.addButton}>
            <PlusCircle size={18} /> Add New Booking
          </Button>
        </div>
      </header>

      {fetchError && !loadingBookings && (
        <div className={styles.errorFallback}>
          <p>Could not load bookings: {fetchError.message}</p>
          <Button onClick={loadBookings}>Try Again</Button>
        </div>
      )}

      {!fetchError && (
        <div className={styles.tableContainer}>
          <table className={styles.bookingsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.customer?.name || `ID: ${booking.customerId}`}</td>
                  <td>{booking.room?.roomNumber || `ID: ${booking.roomId}`}</td>
                  <td>{new Date(booking.checkInTime).toLocaleString()}</td>
                  <td>{new Date(booking.checkOutTime).toLocaleString()}</td>
                  <td><span className={`${styles.statusBadge} ${styles[booking.status?.toLowerCase()]}`}>{booking.status}</span></td>
                  <td>
                    <Button onClick={() => openFormModal(booking)} className={`${styles.actionButton} ${styles.editButton}`} aria-label="Edit">
                      <Edit size={16} />
                    </Button>
                    <Button onClick={() => handleDeleteBooking(booking.bookingId)} className={`${styles.actionButton} ${styles.deleteButton}`} aria-label="Delete" disabled={deletingBooking}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className={styles.noBookingsText}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}      {isFormModalOpen && (
        <Modal 
          isOpen={isFormModalOpen} 
          onClose={closeFormModal} 
          title={editingBooking ? 'Edit Booking' : 'Create New Booking'}
        >
          <BookingForm
            onSubmit={handleFormSubmit}
            initialData={editingBooking ? {
              ...editingBooking,
              checkInTime: editingBooking.checkInTime ? new Date(editingBooking.checkInTime).toISOString().slice(0, 16) : '',
              checkOutTime: editingBooking.checkOutTime ? new Date(editingBooking.checkOutTime).toISOString().slice(0, 16) : '',
            } : { checkInTime: new Date().toISOString().slice(0,16) } }
            isLoading={creatingBooking || updatingBooking}
            onCancel={closeFormModal} // Pass cancel handler to form if it needs a cancel button
          />
        </Modal>
      )}      <AddRoomPopup
        isOpen={isAddRoomModalOpen}
        onClose={closeAddRoomModal}
        onSubmit={handleAddRoom}
        roomTypes={roomTypes}
        isLoading={creatingRoom}
      />

      <AddRoomTypePopup
        isOpen={isAddRoomTypeModalOpen}
        onClose={closeAddRoomTypeModal}
        onSubmit={handleAddRoomType}
        isLoading={creatingRoomType}
      />
    </div>
  );
};

export default Bookings;