import {NextResponse} from 'next/server';
import {BASE_API_URL} from "@/app/[locale]/lib/utils";
import {getLocale, getTranslations} from "next-intl/server";
import {getSession} from '@/app/[locale]/lib/session';

export async function GET() {
    try {
        const locale =  await getLocale();
        const t = await getTranslations({locale, namespace: ''});
        const user = await getSession();
        if (!user || !user.userToken) {
            return NextResponse.json({error: t('API.unauthorized')}, {status: 401});
        }


        console.log("Locale for amenities API:", locale);

        const response = await fetch(`${BASE_API_URL}/management/amenities/${locale}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            },
            cache: 'no-store', // Wyłączenie cache'owania
        });

        if (!response.ok) {
            if (response.status === 409) {
                return NextResponse.json({error: t('API.reviewAlreadyExists')}, {status: 409});
            }
            console.error(`Backend returned status: ${response.status}`);
            throw new Error(`Backend API error: ${response.statusText}`);
        }

        const data = await response.json();
        // Zwracamy dane w formatowaniu zgodnym z oczekiwaniami frontendu
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in hotel search API:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
