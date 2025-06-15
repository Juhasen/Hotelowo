import { NextResponse } from 'next/server';
import {getLocale} from "next-intl/server";
import {BASE_API_URL} from "@/app/[locale]/lib/utils";

export async function GET(request: Request) {
    try {
        const locale =  await getLocale();

        const { searchParams } = new URL(request.url);

        const id = searchParams.get('id');

        // Budowanie URL do backendu
        const backendUrl = new URL(`${BASE_API_URL}/hotel/${locale}/${id}`);

        console.log(`Calling backend API: ${backendUrl.toString()}`);
        const response = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
