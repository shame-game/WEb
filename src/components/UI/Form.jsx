import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X } from 'lucide-react';
import Button from './Button';
import styles from './Form.module.css';

const Form = ({ 
  onSubmit, 
  onCancel,
  validationSchema, 
  defaultValues = {},
  initialData = {},
  fields = [], // For field-based form
  children,
  className = '',
  submitText = 'Lưu',
  cancelText = 'Hủy'
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues
  } = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues: initialData || defaultValues
  });

  const formMethods = {
    control,
    errors,
    reset,
    watch,
    setValue,
    getValues
  };

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // If fields are provided, render field-based form
  if (fields && fields.length > 0) {
    return (
      <form 
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`${styles.form} ${className}`}
      >
        {fields.map((field) => (
          <FormField 
            key={field.name}
            {...field}
            control={control}
            errors={errors}
          />
        ))}
        
        <div className={styles.formActions}>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Đang lưu...' : submitText}
          </Button>
          {onCancel && (
            <Button 
              type="button" 
              onClick={onCancel}
              variant="secondary"
              disabled={isSubmitting}
              className={styles.cancelButton}
            >
              {cancelText}
            </Button>
          )}
        </div>
      </form>
    );
  }

  // Otherwise use render props pattern
  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`${styles.form} ${className}`}
    >
      {typeof children === 'function' ? children(formMethods) : children}
    </form>
  );
};

// Form Field Components
export const FormField = ({ 
  name, 
  label, 
  type = 'text', 
  placeholder,
  required = false,
  control,
  errors,
  options = [], // for select, radio
  multiple = false, // for select
  rows = 3, // for textarea
  className = '',
  ...props
}) => {
  const error = errors[name];

  const renderInput = (field) => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...field}
            placeholder={placeholder}
            rows={rows}
            className={`${styles.textarea} ${error ? styles.error : ''} ${className}`}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            {...field}
            multiple={multiple}
            className={`${styles.select} ${error ? styles.error : ''} ${className}`}
            {...props}
          >
            <option value="">Chọn...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={styles.radioGroup}>
            {options.map((option) => (
              <div key={option.value} className={styles.radioItem}>
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={styles.radioInput}
                />
                <label 
                  htmlFor={`${name}-${option.value}`}
                  className={styles.radioLabel}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
              className={styles.checkboxInput}
              {...props}
            />
            <label className={styles.checkboxLabel}>
              {label}
            </label>
          </div>
        );

      default:
        return (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className={`${styles.input} ${error ? styles.error : ''} ${className}`}
            {...props}
          />
        );
    }
  };

  return (
    <div className={styles.formGroup}>
      {type !== 'checkbox' && label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderInput(field)}
      />
      
      {error && (
        <span className={styles.errorMessage}>
          {error.message}
        </span>
      )}
    </div>
  );
};

export const FormRow = ({ children }) => {
  return <div className={styles.formRow}>{children}</div>;
};

export const FileUpload = ({ 
  name, 
  label, 
  accept,
  multiple = false,
  required = false,
  control,
  errors,
  maxSize = 5 * 1024 * 1024, // 5MB
  ...props
}) => {
  const error = errors[name];

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div>
            <div className={styles.fileInput}>
              <input
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  
                  // Validate file size
                  const validFiles = files.filter(file => {
                    if (file.size > maxSize) {
                      alert(`File ${file.name} quá lớn. Kích thước tối đa là ${maxSize / 1024 / 1024}MB`);
                      return false;
                    }
                    return true;
                  });
                  
                  onChange(multiple ? validFiles : validFiles[0]);
                }}
                style={{ display: 'none' }}
                id={`file-${name}`}
                {...props}
              />
              <label htmlFor={`file-${name}`} className={styles.fileInputText}>
                Chọn file hoặc kéo thả vào đây
              </label>
            </div>
            
            {value && (
              <div className={styles.fileList}>
                {multiple ? (
                  value.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = value.filter((_, i) => i !== index);
                          onChange(newFiles);
                        }}
                        className={styles.removeFileButton}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.fileItem}>
                    <span>{value.name}</span>
                    <button
                      type="button"
                      onClick={() => onChange(null)}
                      className={styles.removeFileButton}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      />
      
      {error && (
        <span className={styles.errorMessage}>
          {error.message}
        </span>
      )}
    </div>
  );
};

export default Form;
