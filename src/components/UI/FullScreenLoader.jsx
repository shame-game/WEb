import React from 'react';
import styles from './FullScreenLoader.module.css';

const FullScreenLoader = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.loader}></div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default FullScreenLoader;
