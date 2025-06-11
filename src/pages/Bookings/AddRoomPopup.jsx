import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import styles from './AddRoomPopup.module.css';

const AddRoomPopup = ({ isOpen, onClose, onSubmit, roomTypes = [], isLoading = false }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    price: '',
    floor: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Số phòng là bắt buộc';
    }

    if (!formData.roomTypeId) {
      newErrors.roomTypeId = 'Loại phòng là bắt buộc';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phòng phải lớn hơn 0';
    }

    if (!formData.floor || parseInt(formData.floor) <= 0) {
      newErrors.floor = 'Tầng phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      roomNumber: '',
      roomTypeId: '',
      price: '',
      floor: '',
      description: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Thêm phòng mới</h2>
          <button 
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Room Number */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Số phòng <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.roomNumber ? styles.inputError : ''}`}
                placeholder="Nhập số phòng (vd: 101, 102...)"
                disabled={isLoading}
              />
              {errors.roomNumber && (
                <span className={styles.errorMessage}>{errors.roomNumber}</span>
              )}
            </div>

            {/* Room Type */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Loại phòng <span className={styles.required}>*</span>
              </label>
              <select
                name="roomTypeId"
                value={formData.roomTypeId}
                onChange={handleInputChange}
                className={`${styles.select} ${errors.roomTypeId ? styles.inputError : ''}`}
                disabled={isLoading}
              >
                <option value="">Chọn loại phòng</option>
                {roomTypes.map(type => (
                  <option key={type.roomTypeId} value={type.roomTypeId}>
                    {type.roomTypeName}
                  </option>
                ))}
              </select>
              {errors.roomTypeId && (
                <span className={styles.errorMessage}>{errors.roomTypeId}</span>
              )}
            </div>

            {/* Price */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giá phòng (VNĐ/đêm) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                placeholder="Nhập giá phòng"
                min="0"
                step="1000"
                disabled={isLoading}
              />
              {errors.price && (
                <span className={styles.errorMessage}>{errors.price}</span>
              )}
            </div>

            {/* Floor */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tầng <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.floor ? styles.inputError : ''}`}
                placeholder="Nhập số tầng"
                min="1"
                disabled={isLoading}
              />
              {errors.floor && (
                <span className={styles.errorMessage}>{errors.floor}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Nhập mô tả về phòng (tuỳ chọn)"
              rows="3"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Thêm phòng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomPopup;
