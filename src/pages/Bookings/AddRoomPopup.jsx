import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import styles from './AddRoomPopup.module.css';

const schema = yup.object().shape({
  roomNumber: yup.string().required('Số phòng là bắt buộc'),
  roomTypeId: yup.number().required('Loại phòng là bắt buộc'),
  price: yup.number().required('Giá phòng là bắt buộc').min(0, 'Giá phòng phải lớn hơn 0'),
  status: yup.string().required('Trạng thái là bắt buộc'),
});

const AddRoomPopup = ({ isOpen, onClose, onSubmit, roomTypes, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roomNumber: '',
      roomTypeId: '',
      price: '',
      status: '',
    },
  });

  const selectedRoomTypeId = watch('roomTypeId');

  // Tự động cập nhật roomTypeName khi chọn roomTypeId
  useEffect(() => {
    if (selectedRoomTypeId && roomTypes.length > 0) {
      const selectedRoomType = roomTypes.find(rt => rt.roomTypeId === Number(selectedRoomTypeId));
      if (selectedRoomType) {
        // Không cần setValue cho roomTypeName vì nó sẽ được tự động lấy từ selectedRoomType
      }
    }
  }, [selectedRoomTypeId, roomTypes, setValue]);  const handleFormSubmit = (data) => {
    // Chỉ gửi những thông tin cần thiết, tránh circular reference
    onSubmit({
      roomNumber: data.roomNumber,
      roomTypeId: Number(data.roomTypeId),
      price: Number(data.price),
      status: data.status
      // Không gửi roomType object và bookings để tránh circular reference
    });
    reset();
  };

  return (    <Modal isOpen={isOpen} onClose={onClose} title="Thêm phòng mới" size="medium">
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="roomNumber" className={styles.label}>
            Số phòng <span className={styles.required}>*</span>
          </label>
          <input
            id="roomNumber"
            type="text"
            placeholder="Nhập số phòng (VD: 101, A-205)"
            className={styles.input}
            {...register('roomNumber')}
          />
          {errors.roomNumber && <span className={styles.error}>{errors.roomNumber.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="roomTypeId" className={styles.label}>
            Loại phòng <span className={styles.required}>*</span>
          </label>
          <select
            id="roomTypeId"
            className={styles.select}
            {...register('roomTypeId')}
          >
            <option value="">Chọn loại phòng</option>
            {roomTypes.map(rt => (
              <option key={rt.roomTypeId} value={rt.roomTypeId}>
                {rt.roomTypeName}
              </option>
            ))}
          </select>
          {errors.roomTypeId && <span className={styles.error}>{errors.roomTypeId.message}</span>}
        </div>

        {selectedRoomTypeId && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Loại phòng đã chọn</label>
            <div className={styles.selectedInfo}>
              {roomTypes.find(rt => rt.roomTypeId === Number(selectedRoomTypeId))?.roomTypeName || 'Không xác định'}
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Giá/đêm <span className={styles.required}>*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Nhập giá phòng (VD: 150000)"
            className={styles.input}
            {...register('price')}
          />
          {errors.price && <span className={styles.error}>{errors.price.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.label}>
            Trạng thái phòng <span className={styles.required}>*</span>
          </label>
          <select
            id="status"
            className={styles.select}
            {...register('status')}
          >
            <option value="">Chọn trạng thái</option>
            <option value="Available">Trống</option>
            <option value="Occupied">Đang ở</option>
            <option value="Maintenance">Bảo trì</option>
            <option value="Cleaning">Dọn dẹp</option>
          </select>
          {errors.status && <span className={styles.error}>{errors.status.message}</span>}
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Đang tạo phòng...' : 'Tạo phòng'}
          </Button>
          <Button type="button" onClick={onClose} variant="secondary" className={styles.cancelButton}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoomPopup;
