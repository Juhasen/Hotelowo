import { NextResponse } from 'next/server';
import { getSession } from '@/app/[locale]/lib/session'; // or wherever your session logic is

export async function GET() {
    const session = await getSession();

    if (!session || !session.access_token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // Optionally fetch user info here with the token if needed
    return NextResponse.json({ user: { access_token: session.access_token } });
}