import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import styles from './AddRoomTypePopup.module.css';

const schema = yup.object().shape({
  roomTypeName: yup.string().required('Tên loại phòng là bắt buộc'),
});

const AddRoomTypePopup = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roomTypeName: '',
    },
  });
  const handleFormSubmit = (data) => {
    // Chỉ gửi roomTypeName, database sẽ tự tạo roomTypeId
    onSubmit({
      roomTypeName: data.roomTypeName,
      // Không gửi roomTypeId và rooms vì đây là tạo mới
    });
    reset();
  };

  return (    <Modal isOpen={isOpen} onClose={onClose} title="Thêm loại phòng" size="small">
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="roomTypeName" className={styles.label}>
            Tên loại phòng <span className={styles.required}>*</span>
          </label>
          <input
            id="roomTypeName"
            type="text"
            placeholder="Nhập tên loại phòng (VD: Deluxe Suite, Standard Room)"
            className={styles.input}
            {...register('roomTypeName')}
          />
          {errors.roomTypeName && (
            <span className={styles.error}>{errors.roomTypeName.message}</span>
          )}
        </div>
        
        <div className={styles.actions}>
          <Button 
            type="submit" 
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Đang tạo...' : 'Tạo loại phòng'}
          </Button>
          <Button 
            type="button" 
            onClick={onClose} 
            variant="secondary"
            className={styles.cancelButton}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoomTypePopup;
