import { NextRequest, NextResponse } from 'next/server';
import { BASE_API_URL } from '@/app/[locale]/lib/utils';
import { getSession } from '@/app/[locale]/lib/session';
import { getLocale, getTranslations } from 'next-intl/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

        const response = await fetch(`${BASE_API_URL}/management/users/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            }
        });

        if (response.status !== 204) {
            if (response.status === 403) {
                return NextResponse.json({ error: t('API.forbidden') }, { status: 403 });
            }

            return NextResponse.json({ error: t('API.deleteUserFailed') }, { status: response.status });
        }

        return NextResponse.json({ message: t('AdminUsers.userDeleted') });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

        const requestBody = await req.json();

        const response = await fetch(`${BASE_API_URL}/management/users/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            if (response.status === 403) {
                return NextResponse.json({ error: t('API.forbidden') }, { status: 403 });
            }

            return NextResponse.json({ error: t('API.updateUserFailed') }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}