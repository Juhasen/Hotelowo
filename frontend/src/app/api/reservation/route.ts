import { NextResponse } from 'next/server';
import { BASE_API_URL } from "@/app/[locale]/lib/utils";
import { getSession } from '@/app/[locale]/lib/session';

export async function GET(request: Request) {
    try {
        // Pobieranie parametrów z URLa
        const url = new URL(request.url);
        const roomId = url.searchParams.get('roomId');
        const hotelId = url.searchParams.get('hotelId');
        const checkIn = url.searchParams.get('checkIn');
        const checkOut = url.searchParams.get('checkOut');

        // Weryfikacja parametrów
        if (!roomId || !hotelId || !checkIn || !checkOut) {
            console.error('Brakujące parametry rezerwacji');
            return NextResponse.json({ error: 'Wymagane wszystkie parametry rezerwacji' }, { status: 400 });
        }

        // Pobieranie sesji użytkownika
        const session = await getSession();
        if (!session?.userToken) {
            return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
        }

        // Budowanie URL do backendu
        const backendUrl = new URL(`${BASE_API_URL}/reservation/preview`);
        backendUrl.searchParams.append('roomId', roomId);
        backendUrl.searchParams.append('hotelId', hotelId);
        backendUrl.searchParams.append('checkInDate', checkIn);
        backendUrl.searchParams.append('checkOutDate', checkOut);

        console.log(`Wywołanie API backendu: ${backendUrl.toString()}`);
        const response = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.userToken}`
            },
            cache: 'no-store', // Wyłączenie cache'owania
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Backend zwrócił status: ${response.status}, błąd: ${errorText}`);
            return NextResponse.json({ error: 'Błąd podczas pobierania danych rezerwacji' }, { status: response.status });
        }

        // Przetwarzanie odpowiedzi
        const reservationData = await response.json();


        return NextResponse.json(reservationData);
    } catch (error) {
        console.error('Błąd w API rezerwacji:', error);
        return NextResponse.json({ error: 'Wystąpił błąd serwera' }, { status: 500 });
    }
}