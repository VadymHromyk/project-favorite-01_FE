'use client';

import React, { useEffect, useState } from 'react';
import styles from './ConfirmationModal.module.css';

export const ConfirmationModal = ({
  title,
  description = 'Ми будемо сумувати за вами!',
  confirmButtonText = 'Вийти',
  cancelButtonText = 'Відмінити',
  onConfirm,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleConfirmClick = async () => {
    if (!onConfirm) return;
    try {
      setIsLoading(true);
      await onConfirm(); 
    } catch (error) {
      console.error('Помилка під час запиту:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onCancel} aria-label="Close">
          ×
        </button>

        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelButtonText}
          </button>
          
          <button 
            className={styles.confirmButton} 
            onClick={handleConfirmClick}
            disabled={isLoading}
          >
            {isLoading && <span className={styles.loader}></span>}
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
