'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import { AddReviewForm } from '../AddReviewForm/AddReviewForm';
import toast from 'react-hot-toast';
import styles from './AddReviewModal.module.css';

interface AddReviewModalProps {
  locationId: string;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ locationId }) => {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleFormSubmit = async (values: { rate: number; description: string }) => {
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Передаємо токен, бо відгук може залишити ТІЛЬКИ зареєстрований користувач
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
        body: JSON.stringify({
          locationId,
          ...values,
        }),
      });

      const data = await response.json();

    if (!response.ok) {
        // Якщо бекенд повернув помилку, виводимо її (модалка залишається відкритою, дані не зникають)
        toast.error(data.message || 'Не вдалося зберегти відгук');
        throw new Error(data.message || 'Помилка сервера');
      }

      toast.success('Відгук відправлено на модерацію.');
      handleClose(); // Закриваємо вікно

    } catch (error) {
      // Якщо зник інтернет або впав сервер
      if (!(error instanceof Error && error.message)) {
        toast.error('Сталася помилка зʼєднання з сервером');
      }
      throw error;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.reviewPopup} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.popupCloseBtn} 
          onClick={handleClose} 
          aria-label="Закрити модальне вікно"
        >
          <IoClose size={24} />
        </button>
        <h2 className={styles.popupTitle}>Залишити відгук</h2>
        <AddReviewForm onSubmit={handleFormSubmit} onCancel={handleClose} />
      </div>
    </div>
  );
};
