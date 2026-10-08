import type { Metadata } from "next";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import { Montserrat } from "next/font/google";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Header from "../components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { AuthPromptModal } from "@/src/components/AuthPromptModal/AuthPromptModal";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "RelaxMap",
  description: "App for finding new, beautiful places in Ukraine",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "RelaxMap",
    description: "App for finding new, beautiful places in Ukraine",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "RelaxMap application",
      },
    ],
  },
};

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <>
              {children}
              {modal}
              <AuthPromptModal />
              <Toaster />
            </>
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
