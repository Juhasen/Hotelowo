import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "./components/Header";

const RobotoMono = Roboto({
    subsets: ["latin"],
    variable: "--font-roboto-mono",
    display: "swap",
});

export const metadata: Metadata = {
  title: "Hotelowo",
  description: "Very nice app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${RobotoMono.variable}} antialiased`}
      >
      <Header />
        {children}
      </body>
    </html>
  );
}
