import { NextResponse } from 'next/server';
import {getLocale} from "next-intl/server";
import {BASE_API_URL} from "@/app/[locale]/lib/utils";

export async function GET(request: Request) {
  try {
    const locale =  await getLocale();
    // Pobieranie parametrów z URLa
    const { searchParams } = new URL(request.url);

    // Parametry wyszukiwania
    const country = searchParams.get('country');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const capacityStr = searchParams.get('capacity');

    // Parametry paginacji
    const pageStr = searchParams.get('page') || '0';
    const sizeStr = searchParams.get('size') || '6';

    // Budowanie URL do backendu
    const backendUrl = new URL(`${BASE_API_URL}/hotel/${locale}`);

    // Dodawanie parametrów wyszukiwania do backendu
    if (country) backendUrl.searchParams.append('country', country);
    if (checkIn) backendUrl.searchParams.append('checkInDate', checkIn);
    if (checkOut) backendUrl.searchParams.append('checkOutDate', checkOut);
    if (capacityStr) backendUrl.searchParams.append('numberOfGuests', capacityStr);

    //Dodawanie parametrów paginacji do backendu
    backendUrl.searchParams.append('page', pageStr);
    backendUrl.searchParams.append('size', sizeStr);
    backendUrl.searchParams.append('sort', '');


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
