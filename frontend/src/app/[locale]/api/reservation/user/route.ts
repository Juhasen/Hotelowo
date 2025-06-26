import { NextResponse } from 'next/server';
import {BASE_API_URL} from "@/app/[locale]/lib/utils";
import {getTranslations} from "next-intl/server";
import { getSession } from '@/app/[locale]/lib/session';

export async function GET() {
    try {
        const t = await getTranslations({ locale: 'pl', namespace: '' });

        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({error: t('API.unauthorized')}, {status: 401});
        }

        console.log("Calling: ", `${BASE_API_URL}/reservation/user`);
        const response = await fetch(`${BASE_API_URL}/reservation/user`, {
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
