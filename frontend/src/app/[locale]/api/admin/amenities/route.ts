import {NextResponse} from "next/server";
import {getLocale, getTranslations} from "next-intl/server";
import {getSession} from "@/app/[locale]/lib/session";
import {BASE_API_URL} from "@/app/[locale]/lib/utils";

export async function GET() {
    try {
        const locale = await getLocale();
        const t = await getTranslations({locale, namespace: ''});
        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({error: t('API.unauthorized')}, {status: 401});
        }

        const response = await fetch(`${BASE_API_URL}/management/amenities/${locale}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 403) {
                return NextResponse.json({error: t('API.forbidden')}, {status: 403});
            }
            throw new Error(`Backend API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in hotels API:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}