import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import styles from './AddRoomTypePopup.module.css';

const schema = yup.object().shape({
  roomTypeName: yup.string().required('Room type name is required'),
});

const AddRoomTypePopup = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roomTypeName: '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Room Type" size="medium">
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="roomTypeName" className={styles.label}>
            Room Type Name <span className={styles.required}>*</span>
          </label>
          <input
            id="roomTypeName"
            type="text"
            placeholder="Enter room type name (e.g., Standard Room, Deluxe Suite)"
            className={styles.input}
            {...register('roomTypeName')}
          />
          {errors.roomTypeName && <span className={styles.error}>{errors.roomTypeName.message}</span>}
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Creating...' : 'Create Room Type'}
          </Button>
          <Button type="button" onClick={onClose} variant="secondary" className={styles.cancelButton}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoomTypePopup;
