import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";

import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolLend - Decentralized Loans on Solana",
  description:
    "Borrow SOL against on-chain collateral with risk-based terms on Solana.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex-1 flex flex-col">
            <Navbar />
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
