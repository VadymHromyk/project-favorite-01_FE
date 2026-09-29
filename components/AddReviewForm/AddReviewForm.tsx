'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { reviewValidationSchema } from '../AddReviewModal/validation';
import { FaStar, FaRegStar } from 'react-icons/fa';
import styles from './AddReviewForm.module.css';

interface ReviewFormValues {
  rate: number;
  description: string;
}

interface AddReviewFormProps {
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  onCancel: () => void;
}

const STARS_COUNT = [1, 2, 3, 4, 5];

export const AddReviewForm: React.FC<AddReviewFormProps> = ({ onSubmit, onCancel }) => {
  const [hoverRate, setHoverRate] = useState<number | null>(null);
  const initialValues: ReviewFormValues = { rate: 0, description: '' };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={reviewValidationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onSubmit(values);
          resetForm();
        } catch (error) {
          // console.error(error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className={styles.reviewForm}>
          <div className={styles.formInputGroup}>
            <label className={styles.inputLabel}>Ваш відгук</label>
            <Field
              as="textarea"
              name="description"
              placeholder="Напишіть ваш відгук"
              className={styles.reviewTextarea}
              disabled={isSubmitting}
            />
            <ErrorMessage name="description" component="div" className={styles.validationError} />
          </div>

          <div className={styles.formInputGroup}>
            <div className={styles.ratingStarsRow}>
              {STARS_COUNT.map((star: number) => {
                const currentRating = hoverRate !== null ? hoverRate : values.rate;
                return (
                  <button
                    type="button"
                    key={star}
                    className={styles.interactiveStarItem}
                    onClick={() => setFieldValue('rate', star)}
                    onMouseEnter={() => setHoverRate(star)}
                    onMouseLeave={() => setHoverRate(null)}
                    disabled={isSubmitting}
                  >
                    {star <= currentRating ? (
                      <FaStar className={`${styles.starIcon} ${styles.starActive}`} />
                    ) : (
                      <FaRegStar className={`${styles.starIcon} ${styles.starInactive}`} />
                    )}
                  </button>
                );
              })}
            </div>
            <ErrorMessage name="rate" component="div" className={styles.validationError} />
          </div>

          <div className={styles.formButtonsLayout}>
            <button
              type="button"
              className={styles.dismissFormBtn}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Відмінити
            </button>
            <button type="submit" className={styles.submitReviewBtn} disabled={isSubmitting}>
              {isSubmitting ? <div className={styles.btnSpinner} /> : 'Надіслати'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
