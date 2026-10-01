'use client';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/src/lib/api';
import styles from './LoginForm.module.css';

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Введіть коректну email-адресу')
        .required('Поле обовʼязкове для заповнення'),
    password: Yup.string()
        .min(6, 'Пароль має містити щонайменше 6 символів')
        .required('Поле обовʼязкове для заповнення'),
});

interface FormValues {
    email: string;
    password: string;
}

export default function LoginForm() {
    const router = useRouter();

    const initialValues: FormValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            const response = await api.post('/auth/login', values);

            toast.success('Авторизація успішна!');

            const userId = response.data?.user?.id || response.data?.id;
            if (userId) {
                router.push(`/profile/${userId}`);
            } else {
                router.push('/profile');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || 'Помилка авторизації. Перевірте введені дані.';
                toast.error(errorMessage);
            } else {
                toast.error('Щось пішло не так. Спробуйте пізніше.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={false}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form className={styles.form} noValidate>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Пошта*
                        </label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="hello@relaxmap.ua"
                            className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ''
                                }`}
                        />
                        {touched.email && errors.email && (
                            <span className={styles.errorMessage}>{errors.email}</span>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Пароль*
                        </label>
                        <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ''
                                }`}
                        />
                        {touched.password && errors.password && (
                            <span className={styles.errorMessage}>{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.submitBtn}
                    >
                        {isSubmitting ? 'Завантаження...' : 'Увійти'}
                    </button>
                </Form>
            )}
        </Formik>
    );
}