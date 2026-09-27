'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModalStore } from '../../store/useAuthModalStore';
import styles from './AuthPromptModal.module.css';

export const AuthPromptModal = () => {
  const router = useRouter();
  const { isOpen, closeModal } = useAuthModalStore();

  if (!isOpen) return null;

  const handleLogin = () => {
    closeModal();
    router.push('/login');
  };

  const handleRegister = () => {
    closeModal();
    router.push('/register');
  };

  return (
    <div className={styles.backdrop} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={closeModal} aria-label="Close">
          ×
        </button>

        <h2 className={styles.title}>Помилка під час додавання відгуку</h2>
        <p className={styles.description}>
          Щоб залишити відгук вам треба увійти, якщо ще немає облікового запису зареєструйтесь
        </p>

        <div className={styles.actions}>
          <button className={styles.loginButton} onClick={handleLogin}>
            Увійти
          </button>
          <button className={styles.registerButton} onClick={handleRegister}>
            Зареєструватись
          </button>
        </div>
      </div>
    </div>
  );
};
