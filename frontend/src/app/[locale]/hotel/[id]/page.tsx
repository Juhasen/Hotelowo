"use client";

import { useSearchParams, useParams } from 'next/navigation';

export default function HotelPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params?.id; // pobiera id z /hotel/[id]
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const capacity = searchParams.get('capacity');

    const locale = params?.locale || 'en'; // pobiera locale z /[locale]/hotel/[id]

    const fetchHotelDetails = async () => {
        const searchUrl = new URL(`/${locale}/api/hotel/${id}`, window.location.origin);

        if (checkIn) searchUrl.searchParams.append('checkIn', checkIn);
        if (checkOut) searchUrl.searchParams.append('checkOut', checkOut);
        if (capacity) searchUrl.searchParams.append('capacity', capacity.toString());

        console.log('Fetching hotel from:', searchUrl.toString());

        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Hotel data:', data);
    }

    fetchHotelDetails();

    return (
        <div>
        <h1>Hotel Page</h1>
        <p>Welcome to the hotel page!</p>
        </div>
    );
}