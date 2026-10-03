import type { Metadata } from 'next';
import './globals.css';
import { Roboto } from 'next/font/google';
import TanstackProvider from '@/components/Locations/TanStackProvider/TanStackProvider';

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'App for creating your notes',
  openGraph: {
    title: 'NoteHub',
    description: 'App for creating your notes',
    url: 'https://08-zustand-rust-phi.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub application',
      },
    ],
  },
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanstackProvider>
          {/*  <AuthProvider> */}
          <>
            {children}
            {modal}
          </>
          {/*  <Footer />
          </AuthProvider>*/}
        </TanstackProvider>
      </body>
    </html>
  );
}
