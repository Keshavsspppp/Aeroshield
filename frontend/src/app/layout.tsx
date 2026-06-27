import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AeroShield — Smart City Decision Support",
  description: "Real-time traffic monitoring, air quality tracking, and incident management for the Raipur-Bhilai corridor (NH-53)",
  keywords: ["AeroShield", "smart city", "traffic monitoring", "air quality", "Raipur", "Bhilai", "DSS"],
  authors: [{ name: "AeroShield Team" }],
  openGraph: {
    title: "AeroShield — Smart City Decision Support",
    description: "Real-time traffic monitoring, air quality tracking, and incident management for the Raipur-Bhilai corridor",
    type: "website",
  },
  other: {
    "theme-color": "#050505",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="font-sans h-full antialiased">{children}</body>
    </html>
  );
}
