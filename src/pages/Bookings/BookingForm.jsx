import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bookingSchema } from '../../utils/validationSchemas';
import styles from './BookingForm.module.css';
import Button from '../../components/UI/Button'; // Corrected import path

const BookingForm = ({ onSubmit, initialData = {}, isLoading, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    if (!initialData.bookingId) { // Reset only for new bookings
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="customerId" className={styles.label}>Customer ID</label>
        <input
          type="number"
          id="customerId"
          {...register('customerId')}
          className={`${styles.input} ${errors.customerId ? styles.inputError : ''}`}
          placeholder="Enter customer ID"
        />
        {errors.customerId && <p className={styles.errorMessage}>{errors.customerId.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="fullName" className={styles.label}>Customer Full Name</label>
        <input
          type="text"
          id="fullName"
          {...register('fullName')}
          className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
          placeholder="Enter full name"
        />
        {errors.fullName && <p className={styles.errorMessage}>{errors.fullName.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Customer Email</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="Enter email"
        />
        {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phoneNumber" className={styles.label}>Customer Phone</label>
        <input
          type="text"
          id="phoneNumber"
          {...register('phoneNumber')}
          className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
          placeholder="Enter phone number"
        />
        {errors.phoneNumber && <p className={styles.errorMessage}>{errors.phoneNumber.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.label}>Customer Address</label>
        <input
          type="text"
          id="address"
          {...register('address')}
          className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
          placeholder="Enter address"
        />
        {errors.address && <p className={styles.errorMessage}>{errors.address.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="roomId" className={styles.label}>Room ID</label>
        <input
          type="number"
          id="roomId"
          {...register('roomId')}
          className={`${styles.input} ${errors.roomId ? styles.inputError : ''}`}
          placeholder="Enter room ID"
        />
        {errors.roomId && <p className={styles.errorMessage}>{errors.roomId.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="roomNumber" className={styles.label}>Room Number</label>
        <input
          type="text"
          id="roomNumber"
          {...register('roomNumber')}
          className={`${styles.input} ${errors.roomNumber ? styles.inputError : ''}`}
          placeholder="Enter room number"
        />
        {errors.roomNumber && <p className={styles.errorMessage}>{errors.roomNumber.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="roomTypeId" className={styles.label}>Room Type ID</label>
        <input
          type="number"
          id="roomTypeId"
          {...register('roomTypeId')}
          className={`${styles.input} ${errors.roomTypeId ? styles.inputError : ''}`}
          placeholder="Enter room type ID"
        />
        {errors.roomTypeId && <p className={styles.errorMessage}>{errors.roomTypeId.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="roomTypeName" className={styles.label}>Room Type Name</label>
        <input
          type="text"
          id="roomTypeName"
          {...register('roomTypeName')}
          className={`${styles.input} ${errors.roomTypeName ? styles.inputError : ''}`}
          placeholder="Enter room type name"
        />
        {errors.roomTypeName && <p className={styles.errorMessage}>{errors.roomTypeName.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="price" className={styles.label}>Room Price</label>
        <input
          type="number"
          id="price"
          {...register('price')}
          className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
          placeholder="Enter price"
        />
        {errors.price && <p className={styles.errorMessage}>{errors.price.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="roomStatus" className={styles.label}>Room Status</label>
        <select
          id="roomStatus"
          {...register('roomStatus')}
          className={`${styles.input} ${errors.roomStatus ? styles.inputError : ''}`}
        >
          <option value="">Select Room Status</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        {errors.roomStatus && <p className={styles.errorMessage}>{errors.roomStatus.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="checkInTime" className={styles.label}>Check-in Time</label>
        <input
          type="datetime-local"
          id="checkInTime"
          {...register('checkInTime')}
          className={`${styles.input} ${errors.checkInTime ? styles.inputError : ''}`}
        />
        {errors.checkInTime && <p className={styles.errorMessage}>{errors.checkInTime.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="checkOutTime" className={styles.label}>Check-out Time</label>
        <input
          type="datetime-local"
          id="checkOutTime"
          {...register('checkOutTime')}
          className={`${styles.input} ${errors.checkOutTime ? styles.inputError : ''}`}
        />
        {errors.checkOutTime && <p className={styles.errorMessage}>{errors.checkOutTime.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status" className={styles.label}>Status</label>
        <select
          id="status"
          {...register('status')}
          className={`${styles.input} ${errors.status ? styles.inputError : ''}`}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="CheckedIn">Checked-In</option>
          <option value="CheckedOut">Checked-Out</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {errors.status && <p className={styles.errorMessage}>{errors.status.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="totalAmount" className={styles.label}>Invoice Total Amount</label>
        <input
          type="number"
          id="totalAmount"
          {...register('totalAmount')}
          className={`${styles.input} ${errors.totalAmount ? styles.inputError : ''}`}
          placeholder="Enter total amount"
        />
        {errors.totalAmount && <p className={styles.errorMessage}>{errors.totalAmount.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="invoiceStatus" className={styles.label}>Invoice Status</label>
        <input
          type="text"
          id="invoiceStatus"
          {...register('invoiceStatus')}
          className={`${styles.input} ${errors.invoiceStatus ? styles.inputError : ''}`}
          placeholder="Enter invoice status"
        />
        {errors.invoiceStatus && <p className={styles.errorMessage}>{errors.invoiceStatus.message}</p>}
      </div>

      {/* Payment Details */}
      <div className={styles.formGroup}>
        <label htmlFor="paymentMethod" className={styles.label}>Payment Method</label>
        <input
          type="text"
          id="paymentMethod"
          {...register('paymentMethod')}
          className={`${styles.input} ${errors.paymentMethod ? styles.inputError : ''}`}
          placeholder="Enter payment method"
        />
        {errors.paymentMethod && <p className={styles.errorMessage}>{errors.paymentMethod.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="paymentAmount" className={styles.label}>Payment Amount</label>
        <input
          type="number"
          id="paymentAmount"
          {...register('paymentAmount')}
          className={`${styles.input} ${errors.paymentAmount ? styles.inputError : ''}`}
          placeholder="Enter payment amount"
        />
        {errors.paymentAmount && <p className={styles.errorMessage}>{errors.paymentAmount.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="paymentDate" className={styles.label}>Payment Date</label>
        <input
          type="datetime-local"
          id="paymentDate"
          {...register('paymentDate')}
          className={`${styles.input} ${errors.paymentDate ? styles.inputError : ''}`}
        />
        {errors.paymentDate && <p className={styles.errorMessage}>{errors.paymentDate.message}</p>}
      </div>

      {/* Booking Service Details */}
      <div className={styles.formGroup}>
        <label htmlFor="serviceId" className={styles.label}>Service ID</label>
        <input
          type="number"
          id="serviceId"
          {...register('serviceId')}
          className={`${styles.input} ${errors.serviceId ? styles.inputError : ''}`}
          placeholder="Enter service ID"
        />
        {errors.serviceId && <p className={styles.errorMessage}>{errors.serviceId.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="serviceName" className={styles.label}>Service Name</label>
        <input
          type="text"
          id="serviceName"
          {...register('serviceName')}
          className={`${styles.input} ${errors.serviceName ? styles.inputError : ''}`}
          placeholder="Enter service name"
        />
        {errors.serviceName && <p className={styles.errorMessage}>{errors.serviceName.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="servicePrice" className={styles.label}>Service Price</label>
        <input
          type="number"
          id="servicePrice"
          {...register('servicePrice')}
          className={`${styles.input} ${errors.servicePrice ? styles.inputError : ''}`}
          placeholder="Enter service price"
        />
        {errors.servicePrice && <p className={styles.errorMessage}>{errors.servicePrice.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="serviceDate" className={styles.label}>Service Date</label>
        <input
          type="datetime-local"
          id="serviceDate"
          {...register('serviceDate')}
          className={`${styles.input} ${errors.serviceDate ? styles.inputError : ''}`}
        />
        {errors.serviceDate && <p className={styles.errorMessage}>{errors.serviceDate.message}</p>}
      </div>

      {/* Form Actions */}
      <div className={styles.formActions}>
        <Button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Saving...' : (initialData.bookingId ? 'Update Booking' : 'Create Booking')}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} className={styles.cancelButton} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default BookingForm;
