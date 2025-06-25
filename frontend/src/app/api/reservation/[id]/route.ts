import { NextResponse } from 'next/server';
import {BASE_API_URL} from "@/app/[locale]/lib/utils";

export async function GET(request: Request) {
    try {
        // Pobieranie parametrów z URLa
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop(); // Pobieranie ID z końca ścieżki
        if (!id) {
            console.error('Hotel ID is missing in the request URL');
            return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
        }

        const response = await fetch(`${BASE_API_URL}/reservation/${id}`, {
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
