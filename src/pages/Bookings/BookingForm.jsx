import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './BookingForm.module.css';
import Button from '../../components/UI/Button';

const BookingForm = ({ 
  onSubmit, 
  initialData = {}, 
  isLoading, 
  onCancel, 
  roomTypes = [], 
  rooms = [], 
  customers = [] 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: initialData,
  });

  const selectedCustomerId = watch('customerId');
  const selectedRoomId = watch('roomId');

  useEffect(() => {
    // Auto-fill customer data when customer is selected
    if (selectedCustomerId) {
      const customer = customers.find(c => c.customerId === parseInt(selectedCustomerId));
      if (customer) {
        setValue('fullName', customer.fullName);
        setValue('email', customer.email);
        setValue('phone', customer.phone);
        setValue('address', customer.address);
      }
    }
  }, [selectedCustomerId, customers, setValue]);

  useEffect(() => {
    // Auto-fill room data when room is selected
    if (selectedRoomId) {
      const room = rooms.find(r => r.roomId === parseInt(selectedRoomId));
      if (room) {
        setValue('roomNumber', room.roomNumber);
        setValue('roomTypeId', room.roomTypeId);
        setValue('price', room.price);
      }
    }
  }, [selectedRoomId, rooms, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    if (!initialData.bookingId) {
      reset();
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        
        {/* Customer Section */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Customer Information</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="customerId" className={styles.label}>
                Customer <span className={styles.required}>*</span>
              </label>
              <select
                id="customerId"
                {...register('customerId', { required: 'Customer is required' })}
                className={`${styles.select} ${errors.customerId ? styles.inputError : ''}`}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.fullName} - {customer.email}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <span className={styles.errorMessage}>{errors.customerId.message}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName" className={styles.label}>Full Name</label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                className={styles.input}
                placeholder="Customer full name"
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={styles.input}
                placeholder="Customer email"
                readOnly
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>Phone</label>
              <input
                type="text"
                id="phone"
                {...register('phone')}
                className={styles.input}
                placeholder="Customer phone"
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>Address</label>
              <input
                type="text"
                id="address"
                {...register('address')}
                className={styles.input}
                placeholder="Customer address"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Room Section */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Room Information</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="roomId" className={styles.label}>
                Room <span className={styles.required}>*</span>
              </label>
              <select
                id="roomId"
                {...register('roomId', { required: 'Room is required' })}
                className={`${styles.select} ${errors.roomId ? styles.inputError : ''}`}
              >
                <option value="">Select Room</option>
                {rooms.filter(room => room.status === 'available').map(room => (
                  <option key={room.roomId} value={room.roomId}>
                    {room.roomNumber} - {room.roomTypeName} (${room.price})
                  </option>
                ))}
              </select>
              {errors.roomId && (
                <span className={styles.errorMessage}>{errors.roomId.message}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="roomNumber" className={styles.label}>Room Number</label>
              <input
                type="text"
                id="roomNumber"
                {...register('roomNumber')}
                className={styles.input}
                placeholder="Room number"
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Price per Night</label>
              <input
                type="number"
                id="price"
                {...register('price')}
                className={styles.input}
                placeholder="Room price"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Booking Details</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="checkInTime" className={styles.label}>
                Check-in Date & Time <span className={styles.required}>*</span>
              </label>
              <input
                type="datetime-local"
                id="checkInTime"
                {...register('checkInTime', { required: 'Check-in time is required' })}
                className={`${styles.input} ${errors.checkInTime ? styles.inputError : ''}`}
              />
              {errors.checkInTime && (
                <span className={styles.errorMessage}>{errors.checkInTime.message}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="checkOutTime" className={styles.label}>
                Check-out Date & Time <span className={styles.required}>*</span>
              </label>
              <input
                type="datetime-local"
                id="checkOutTime"
                {...register('checkOutTime', { required: 'Check-out time is required' })}
                className={`${styles.input} ${errors.checkOutTime ? styles.inputError : ''}`}
              />
              {errors.checkOutTime && (
                <span className={styles.errorMessage}>{errors.checkOutTime.message}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.label}>
                Status <span className={styles.required}>*</span>
              </label>
              <select
                id="status"
                {...register('status', { required: 'Status is required' })}
                className={`${styles.select} ${errors.status ? styles.inputError : ''}`}
              >
                <option value="">Select Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <span className={styles.errorMessage}>{errors.status.message}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="specialRequests" className={styles.label}>Special Requests</label>
              <textarea
                id="specialRequests"
                {...register('specialRequests')}
                className={styles.textarea}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (initialData.bookingId ? 'Update Booking' : 'Create Booking')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
