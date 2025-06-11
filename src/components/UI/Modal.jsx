import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium', // small, medium, large, fullWidth
  closable = true
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closable]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closable) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleBackdropClick}>
      <div className={`${styles.modalContent} ${styles[size]}`}>
        {/* Header */}
        {(title || closable) && (
          <div className={styles.modalHeader}>
            {title && <h3 className={styles.modalTitle}>{title}</h3>}
            {closable && (
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Đóng modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={styles.modalBody}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Modal Button Components for convenience
export const ModalButton = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  ...props 
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'secondary':
        return `${styles.button} ${styles.secondaryButton}`;
      case 'danger':
        return `${styles.button} ${styles.dangerButton}`;
      default:
        return `${styles.button} ${styles.primaryButton}`;
    }
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Modal;
