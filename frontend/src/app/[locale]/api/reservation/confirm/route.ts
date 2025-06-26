import { NextResponse } from 'next/server';
import { BASE_API_URL } from "@/app/[locale]/lib/utils";
import { getSession } from '@/app/[locale]/lib/session';
import { getLocale } from "next-intl/server";

export async function POST(request: Request) {
    try {
        // Parsowanie danych z body
        const { roomId, hotelId, checkIn, checkOut, paymentMethod } = await request.json();
        const locale = await getLocale();
        // Weryfikacja parametrów
        if (!roomId || !hotelId || !checkIn || !checkOut || !paymentMethod) {
            console.error('Brakujące parametry rezerwacji');
            return NextResponse.json({ error: 'Wymagane wszystkie parametry rezerwacji' }, { status: 400 });
        }

        // Pobieranie sesji użytkownika
        const session = await getSession();
        if (!session?.userToken) {
            return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
        }

        const response = await fetch(`${BASE_API_URL}/reservation/confirm/${locale}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.userToken}`
            },
            body: JSON.stringify({
                roomNumber: roomId,
                hotelId: hotelId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                paymentMethod: paymentMethod.toUpperCase()
            }),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Backend zwrócił status: ${response.status}, błąd: ${errorText}`);
            return NextResponse.json({ error: 'Błąd podczas potwierdzania rezerwacji' }, { status: response.status });
        }

        // Przetwarzanie odpowiedzi
        const confirmationData = await response.text();

        return NextResponse.json(confirmationData);
    } catch (error) {
        console.error('Błąd w API rezerwacji:', error);
        return NextResponse.json({ error: 'Wystąpił błąd serwera' }, { status: 500 });
    }
}