import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import { Footer } from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RelaxMap",
  description: "RelaxMap frontend application",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className={montserrat.className}>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            {children}
            {modal}
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
