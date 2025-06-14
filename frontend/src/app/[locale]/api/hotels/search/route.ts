import { NextResponse } from 'next/server';

// Interfejsy dla danych hotelu i odpowiedzi paginowanej
interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

interface Room {
  id: number;
  number: string;
  capacity: number;
  price: number;
  description: string;
  type: string;
}

interface Hotel {
  id: number;
  name: string;
  description: string;
  stars: number;
  address: Address;
  mainImageUrl?: string;
  rooms?: Room[];
}

interface PageResponse {
  content: Hotel[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export async function GET(request: Request) {
  try {
    // Pobieranie parametrów z URLa
    const { searchParams } = new URL(request.url);

    // Parametry wyszukiwania
    const country = searchParams.get('country');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const capacityStr = searchParams.get('capacity');
    const capacity = capacityStr ? parseInt(capacityStr) : undefined;

    // Parametry paginacji
    const pageStr = searchParams.get('page') || '0';
    const sizeStr = searchParams.get('size') || '6';
    const page = parseInt(pageStr);
    const size = parseInt(sizeStr);

    // Budowanie URL do backendu
    const backendUrl = new URL(process.env.BACKEND_API_URL || 'http://localhost:8080/api/hotels/search');

    // Dodawanie parametrów wyszukiwania do backendu
    if (country) backendUrl.searchParams.append('country', country);
    if (checkIn) backendUrl.searchParams.append('checkIn', checkIn);
    if (checkOut) backendUrl.searchParams.append('checkOut', checkOut);
    if (capacityStr) backendUrl.searchParams.append('capacity', capacityStr);

    // Dodawanie parametrów paginacji do backendu
    backendUrl.searchParams.append('page', pageStr);
    backendUrl.searchParams.append('size', sizeStr);

    // Wykonanie zapytania do backendu
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
    console.log('Backend search response:', data);

    // Zwracamy dane w formatowaniu zgodnym z oczekiwaniami frontendu
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in hotel search API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
