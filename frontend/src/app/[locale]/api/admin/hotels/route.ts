import {NextRequest, NextResponse} from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
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

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: NextRequest) {
    try {
        const locale = await getLocale();
        const t = await getTranslations({ locale, namespace: '' });
        const user = await getSession();

        if (!user || !user.userToken) {
            return NextResponse.json({ error: t('API.unauthorized') }, { status: 401 });
        }

        // Parse multipart form
        const formData = await request.formData();
        const fields: Record<string, any> = {};
        const images: string[] = [];

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                // Save file to public/images/hotels
                const filename = `${Date.now()}-${value.name}`;
                const imageDir = path.join(process.cwd(), 'public', 'images', 'hotels');
                await fs.mkdir(imageDir, { recursive: true });
                const filePath = path.join(imageDir, filename);
                const arrayBuffer = await value.arrayBuffer();
                await fs.writeFile(filePath, Buffer.from(arrayBuffer));
                images.push(`/images/hotels/${filename}`);
            } else {
                // Przetwarzaj specjalne pola
                if (key === 'amenityIds' || key === 'rooms') {
                    try {
                        fields[key] = JSON.parse(value as string);
                    } catch (e) {
                        console.error(`Error parsing ${key}:`, e);
                        fields[key] = key === 'amenityIds' ? [] : [];
                    }
                } else if (key === 'address') {
                    try {
                        fields[key] = JSON.parse(value as string);
                    } catch (e) {
                        console.error('Error parsing address:', e);
                        fields[key] = {};
                    }
                } else {
                    fields[key] = value;
                }
            }
        }

        // Build payload
        const payload = {
            ...fields,
            images: images.map((url, idx) => ({ filePath: url, altText: '', isPrimary: idx === 0 })),
        };

        console.log("Wysyłam:", JSON.stringify(payload, null, 2));

        // Validate
        if (!payload.images) {
            return NextResponse.json({ error: t('API.invalidRequest') }, { status: 400 });
        }

        // Forward to backend
        const response = await fetch(`${BASE_API_URL}/management/hotels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.userToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if (response.status === 403) {
                return NextResponse.json({ error: t('API.forbidden') }, { status: 403 });
            }
            throw new Error(`Backend API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error creating hotel:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

