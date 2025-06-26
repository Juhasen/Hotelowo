import {NextRequest, NextResponse} from 'next/server';
import { BASE_API_URL } from '@/app/[locale]/lib/utils';
import { getSession } from '@/app/[locale]/lib/session';
import { getLocale, getTranslations } from 'next-intl/server';

// Pobieranie wszystkich użytkowników
export async function GET() {
    try {
        const locale = await getLocale();
        const t = await getTranslations({ locale, namespace: '' });
        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({ error: t('API.unauthorized') }, { status: 401 });
        }

        const response = await fetch(`${BASE_API_URL}/management/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Backend returned status: ${response.status}`);

            if (response.status === 403) {
                return NextResponse.json({ error: t('API.forbidden') }, { status: 403 });
            }

            throw new Error(`Backend API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        return NextResponse.json(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Error in users API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}