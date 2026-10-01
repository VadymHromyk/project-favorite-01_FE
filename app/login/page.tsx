import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm/LoginForm';
import AuthNav from '@/components/AuthNav/AuthNav';
import styles from './login.module.css';

export const metadata: Metadata = {
    title: 'Вхід | Relax Map',
    description: 'Увійдіть до свого облікового запису Relax Map, щоб зберігати улюблені місця відпочинку.',
    openGraph: {
        title: 'Вхід | Relax Map',
        description: 'Увійдіть до свого облікового запису Relax Map.',
        url: 'https://relaxmap.ua/login',
        siteName: 'Relax Map',
        locale: 'uk_UA',
        type: 'website',
    },
};

export default function LoginPage() {
    return (
        <main className={styles.pageWrapper}>
            <div className={styles.card}>
                <AuthNav />
                <h1 className={styles.title}>Вхід</h1>
                <LoginForm />
            </div>

            <footer className={styles.footer}>
                © 2025 Relax Map
            </footer>
        </main>
    );
}