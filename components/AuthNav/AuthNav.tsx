'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './AuthNav.module.css';

export default function AuthNav() {
    const pathname = usePathname();

    return (
        <div className={styles.navWrapper}>
            <div className={styles.logoWrapper}>
                <Link href="/" className={styles.logoLink}>
                    <Image
                        src="/icons/logo.svg"
                        alt="Relax Map Logo"
                        width={24}
                        height={24}
                        priority
                    />
                    <span className={styles.logoText}>Relax Map</span>
                </Link>
            </div>

            <nav className={styles.navContainer}>
                <Link
                    href="/register"
                    className={`${styles.tab} ${pathname === '/register' ? styles.active : ''}`}
                >
                    Реєстрація
                </Link>
                <Link
                    href="/login"
                    className={`${styles.tab} ${pathname === '/login' ? styles.active : ''}`}
                >
                    Вхід
                </Link>
            </nav>
        </div>
    );
}