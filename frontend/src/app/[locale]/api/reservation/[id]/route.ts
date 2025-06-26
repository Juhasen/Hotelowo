import { NextResponse } from 'next/server';
import {BASE_API_URL} from "@/app/[locale]/lib/utils";
import {getLocale, getTranslations} from "next-intl/server";
import { getSession } from '@/app/[locale]/lib/session';

export async function GET(request: Request) {
    try {
        const t = await getTranslations({ locale: 'pl', namespace: '' });
        // Pobieranie parametrów z URLa
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop(); // Pobieranie ID z końca ścieżki
        if (!id) {
            console.error('Hotel ID is missing in the request URL');
            return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
        }
        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({error: t('API.unauthorized')}, {status: 401});
        }

        const locale = await getLocale();

        console.log("Calling: ", `${BASE_API_URL}/reservation/${locale}/${id}`);
        const response = await fetch(`${BASE_API_URL}/reservation/${locale}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            },
            cache: 'no-store', // Wyłączenie cache'owania
        });

        if (!response.ok) {
            console.error(`Backend returned status: ${response.status}`);
            throw new Error(`Backend API error: ${response.statusText}`);
        }

        // Przetwarzanie odpowiedzi
        const data = await response.json();

        // Zwracamy dane w formatowaniu zgodnym z oczekiwaniami frontendu
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in hotel search API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
