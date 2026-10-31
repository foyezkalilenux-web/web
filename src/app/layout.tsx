import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "আধুনিক ফ্যাশন — Adhunik Fashion | E-Commerce, POS & Loyalty",
  description: "আধুনিক ফ্যাশন - নবীগঞ্জ, ইমামবাড়ী বাজার ও চট্টগ্রাম শাখা। সেন্ট্রালাইজড ই-কমার্স, পিওএস ও মেম্বারশিপ লয়ালটি সিস্টেম।",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="antialiased font-sans bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
