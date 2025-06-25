import { NextResponse } from 'next/server';
import {BASE_API_URL} from "@/app/[locale]/lib/utils";
import {getTranslations} from "next-intl/server";
import { getSession } from '@/app/[locale]/lib/session';

export async function POST(request: Request) {
    try {
        const t = await getTranslations({ locale: 'pl', namespace: '' });

        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({error: t('API.unauthorized')}, {status: 401});
        }

        // Sprawdzanie, czy ciało żądania jest poprawne
        if (!request.body) {
            console.error('Request body is missing');
            return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
        }

        console.log("Calling: ", `${BASE_API_URL}/review`);
        const response = await fetch(`${BASE_API_URL}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            },
            body: await request.text(), // Przekazujemy ciało żądania bezpośrednio
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
