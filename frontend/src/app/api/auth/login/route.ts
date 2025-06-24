import { NextRequest, NextResponse } from 'next/server';
import { LoginFormSchema } from '@/app/[locale]/lib/definitions';
import { createSession } from '@/app/[locale]/lib/session';
import { BASE_API_URL } from '@/app/[locale]/lib/utils';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const validatedFields = LoginFormSchema.safeParse(body);

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errors: { email?: string[]; password?: string[] } = {};
        if (fieldErrors.email) errors.email = fieldErrors.email;
        if (fieldErrors.password) errors.password = fieldErrors.password;

        return NextResponse.json({ errors }, { status: 400 });
    }

    const response = await fetch(BASE_API_URL + '/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        if (response.status === 401) {
            return NextResponse.json({ errors: { email: ['invalid_credentials'] } }, { status: 401 });
        } else if (response.status === 403) {
            return NextResponse.json({ errors: { email: ['account_blocked'] } }, { status: 403 });
        } else if (response.status === 409) {
            return NextResponse.json({ errors: { email: ['account_does_not_exists'] } }, { status: 409 });
        } else if (response.status === 429) {
            return NextResponse.json({ errors: { email: ['too_many_requests'] } }, { status: 429 });
        }

        return NextResponse.json({ errors: { email: ['login_failed'] } }, { status: response.status });
    }

    try {
        const data = await response.json();
        if (!data.access_token) {
            return NextResponse.json({ errors: { email: ['unexpected_response'] } }, { status: 500 });
        }

        await createSession(data.access_token);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('JSON parsing failed:', err);
        return NextResponse.json({ errors: { email: ['invalid_response_format'] } }, { status: 500 });
    }
}
