import {NextResponse} from 'next/server';
import {getSession} from '@/app/[locale]/lib/session';
import {BASE_API_URL} from "@/app/[locale]/lib/utils";

export async function GET() {
    try {
        const user = await getSession();
        if (!user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }
        const response = await fetch(`${BASE_API_URL}/user/me`, {
            headers: {
                'Authorization': `Bearer ${user.userToken}`
            }
        });

        if (!response.ok) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }


        return NextResponse.json({user});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
        return NextResponse.json({error: 'Backend unavailable'}, {status: 503});
    }
}


