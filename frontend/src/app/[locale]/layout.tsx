import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "./components/Header";
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

        <body>
            <NextIntlClientProvider>
                <ThemeRegistry>
                    <Header/>
                    {children}
                </ThemeRegistry>
            </NextIntlClientProvider>
        </body>
        </html>
    );
}
