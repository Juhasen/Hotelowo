import { NextRequest, NextResponse } from 'next/server';
import { BASE_API_URL } from '@/app/[locale]/lib/utils';
import { getSession } from '@/app/[locale]/lib/session';
import { getLocale, getTranslations } from 'next-intl/server';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const locale = await getLocale();
        const t = await getTranslations({ locale, namespace: '' });
        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({ error: t('API.unauthorized') }, { status: 401 });
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: t('API.invalidRequest') }, { status: 400 });
        }

        const response = await fetch(`${BASE_API_URL}/management/hotels/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`,
            },
        });

        if (response.status != 204) {
            if (response.status === 403) {
                return NextResponse.json({ error: t('API.forbidden') }, { status: 403 });
            }
            return NextResponse.json({ error: t('AdminHotels.errorFetchingHotels') }, { status: response.status });
        }

        return NextResponse.json({ message: t('AdminHotels.hotelDeleted') }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}