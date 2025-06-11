import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '', 
  variant = 'primary',
  size = 'medium'
}) => {
  const getButtonClass = () => {
    let baseClass = styles.button;
    
    // Add variant class
    if (styles[variant]) {
      baseClass += ` ${styles[variant]}`;
    }
    
    // Add size class
    if (styles[size]) {
      baseClass += ` ${styles[size]}`;
    }
    
    return baseClass;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonClass()} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
