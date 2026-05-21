import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NestZ - Đo Lường Calo Bữa Ăn",
  description: "Phân tích lượng calo trong bữa ăn qua hình ảnh bằng AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
        {children}
      </body>
    </html>
  );
}
