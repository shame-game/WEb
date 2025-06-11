import React from 'react';
import Modal from './Modal'; // Assuming Modal.jsx is in the same directory
import Button from './Button'; // Assuming Button.jsx is in the same directory
import styles from './ResultPopup.module.css';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ResultPopup = ({ isOpen, onClose, type, title, message, onConfirm }) => {
  if (!isOpen) return null;

  const Icon = {
    success: <CheckCircle size={48} className={`${styles.icon} ${styles.success}`} />,
    error: <XCircle size={48} className={`${styles.icon} ${styles.error}`} />,
    warning: <AlertTriangle size={48} className={`${styles.icon} ${styles.warning}`} />,
  }[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || type.charAt(0).toUpperCase() + type.slice(1)} size="small">
      <div className={styles.content}>
        {Icon}
        {message && <p className={styles.message}>{message}</p>}
      </div>
      <div className={styles.footer}>
        {onConfirm && type !== 'error' && (
          <Button onClick={onConfirm} className={styles.confirmButton}>
            OK
          </Button>
        )}
        <Button onClick={onClose} className={type === 'error' ? styles.errorButton : styles.closeButton}>
          {type === 'error' ? 'Close' : 'Cancel'}
        </Button>
      </div>
    </Modal>
  );
};

export default ResultPopup;
