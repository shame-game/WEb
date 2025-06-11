import React from 'react';
import styles from './StatusBadge.module.css';

const StatusBadge = ({ status, type = 'room' }) => {
  const getStatusClass = (status, type) => {
    const statusMap = {
      room: {
        Available: 'available',
        Booked: 'booked',
        Maintenance: 'maintenance',
        Occupied: 'occupied'
      },
      booking: {
        Booked: 'booked',
        CheckedIn: 'checkedIn',
        CheckedOut: 'checkedOut',
        Cancelled: 'cancelled'
      },
      invoice: {
        Paid: 'paid',
        Unpaid: 'unpaid',
        Cancelled: 'cancelled'
      },
      inventory: {
        InStock: 'inStock',
        LowStock: 'lowStock',
        OutOfStock: 'outOfStock'
      }
    };

    return statusMap[type]?.[status] || 'default';
  };

  const getStatusText = (status, type) => {
    const textMap = {
      room: {
        Available: 'Trống',
        Booked: 'Đã đặt',
        Maintenance: 'Bảo trì',
        Occupied: 'Đang ở'
      },
      booking: {
        Booked: 'Đã đặt',
        CheckedIn: 'Đã checkin',
        CheckedOut: 'Đã checkout',
        Cancelled: 'Đã hủy'
      },
      invoice: {
        Paid: 'Đã thanh toán',
        Unpaid: 'Chưa thanh toán',
        Cancelled: 'Đã hủy'
      },
      inventory: {
        InStock: 'Còn hàng',
        LowStock: 'Sắp hết',
        OutOfStock: 'Hết hàng'
      }
    };

    return textMap[type]?.[status] || status;
  };

  const statusClass = getStatusClass(status, type);
  const statusText = getStatusText(status, type);

  return (
    <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
      {statusText}
    </span>
  );
};

export default StatusBadge;
