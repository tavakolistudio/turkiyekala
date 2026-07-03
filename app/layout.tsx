import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TurkiyeKala — خرید از ترکیه، تحویل در ایران",
  description:
    "لینک محصول را بفرستید یا از پیشنهادهای تخفیف‌دار انتخاب کنید؛ ما خرید، ارسال تا تهران و پیگیری سفارش را انجام می‌دهیم.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className={`${vazir.className} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
