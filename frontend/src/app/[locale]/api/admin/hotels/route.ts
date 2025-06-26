import {NextRequest, NextResponse} from 'next/server';
import { BASE_API_URL } from '@/app/[locale]/lib/utils';
import { getSession } from '@/app/[locale]/lib/session';
import { getLocale, getTranslations } from 'next-intl/server';

export async function GET(request: NextRequest) {
    try {
        const locale = await getLocale();
        const t = await getTranslations({ locale, namespace: '' });
        const user = await getSession();
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '10';

        if (!user || !user.userToken) {
            return NextResponse.json({ error: t('API.unauthorized') }, { status: 401 });
        }

        const response = await fetch(`${BASE_API_URL}/management/hotels?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 403) {
                return NextResponse.json({ error: t('API.forbidden') }, { status: 403 });
            }
            throw new Error(`Backend API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in hotels API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}