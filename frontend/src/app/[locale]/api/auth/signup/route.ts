import { NextRequest, NextResponse } from 'next/server';
import { SignupFormSchema } from '@/app/[locale]/lib/definitions';
import { createSession } from '@/app/[locale]/lib/session';
import { BASE_API_URL } from '@/app/[locale]/lib/utils';

export async function POST(req: NextRequest) {
    const formData = await req.json();

    const validatedFields = SignupFormSchema.safeParse(formData);

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors as Record<string, string[]>;
        const translatedErrors: Record<string, string[]> = {};

        for (const key in fieldErrors) {
            if (Array.isArray(fieldErrors[key])) {
                translatedErrors[key] = (fieldErrors[key] as string[]).map((err: string) => {
                    switch (key) {
                        case 'firstname':
                            return 'firstnameRequired';
                        case 'lastname':
                            return 'lastnameRequired';
                        case 'email':
                            return 'emailInvalid';
                        case 'password':
                            if (err.includes('8')) return 'passwordMinLength';
                            if (err.toLowerCase().includes('letter')) return 'passwordLetterRequired';
                            if (err.toLowerCase().includes('number')) return 'passwordNumberRequired';
                            if (err.toLowerCase().includes('special')) return 'passwordSpecialCharRequired';
                            return 'passwordInvalid';
                        case 'confirmPassword':
                            return 'confirmPasswordRequired';
                        default:
                            return err;
                    }
                });
            }
        }

        return NextResponse.json({ errors: translatedErrors }, { status: 400 });
    }

    const res = await fetch(BASE_API_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...validatedFields.data,
            role: 'USER',
        }),
    });

    if (!res.ok) {
        const text = await res.text();

        if (res.status === 409) {
            return NextResponse.json({ errors: { email: ['emailTaken'] } }, { status: 409 });
        }

        if (res.status === 406) {
            return NextResponse.json({ errors: { username: ['usernameTaken'] } }, { status: 406 });
        }

        return NextResponse.json({ errors: { email: ['errorMessage'] } }, { status: res.status });
    }

    const data = await res.json();
    if (!data.access_token) {
        return NextResponse.json({ errors: { email: ['Unexpected response from server'] } }, { status: 500 });
    }

    await createSession(data.access_token);
    return NextResponse.json({ success: true }, { status: 200 });
}
