import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-calendar/dist/Calendar.css";
import { Sidebar } from "@/features";

const geistSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Appointments",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-white`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
