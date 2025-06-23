import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import ThemeRegistry from './lib/ThemeRegistry';

export const metadata: Metadata = {
    title: "Hotelowo",
    description: "Very nice app",
};

export default async function RootLayout({
                                             children,
                                             params
                                         }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    return (
        <html lang={locale}>
        <head>
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body>
            <NextIntlClientProvider>
                <ThemeRegistry>
                    <Header/>
                    {children}
                    <Footer/>
                </ThemeRegistry>
            </NextIntlClientProvider>
        </body>
        </html>
    );
}
