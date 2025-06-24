import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, getSession } from '@/app/[locale]/lib/session';
import { BASE_API_URL } from '@/app/[locale]/lib/utils';
import { getTranslations } from 'next-intl/server';

export async function GET(request: NextRequest) {
    try {
        // Get translations based on the request locale
        const { pathname } = new URL(request.url);
        const locale = pathname.split('/')[1];
        const t = await getTranslations({ locale, namespace: '' });

        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({error: t('API.unauthorized')}, {status: 401});
        }

        try {
            const response = await fetch(`${BASE_API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${user.userToken}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                await deleteSession();
                return NextResponse.json({
                    error: `${t('API.serverError')}: ${response.status}`,
                    details: errorText
                }, {status: response.status});
            }

            const userData = await response.json();
            return NextResponse.json(userData);
        } catch (apiError) {
            const errorMessage = apiError instanceof Error ? apiError.message : t('API.internalServerError');
            return NextResponse.json({
                error: t('API.userNotFound'),
                details: errorMessage
            }, {status: 500});
        }
    } catch (sessionError) {
        // Fallback to default locale if there's a session error
        const defaultLocale = 'pl';
        const t = await getTranslations({ locale: defaultLocale, namespace: '' });

        const errorMessage = sessionError instanceof Error ? sessionError.message : t('API.internalServerError');
        return NextResponse.json({
            error: t('API.unauthorized'),
            details: errorMessage
        }, {status: 500});
    }
}
