import { NextResponse } from 'next/server';
import { getSession } from '@/app/[locale]/lib/session'; // or wherever your session logic is

export async function GET() {
    const session = await getSession();

    if (!session || !session.userToken) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    return NextResponse.json({ user: { access_token: session.access_token } });
}