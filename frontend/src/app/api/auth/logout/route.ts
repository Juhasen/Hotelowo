import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/app/[locale]/lib/session';

export async function POST(req: NextRequest) {
    await deleteSession();
    return NextResponse.json({ success: true }, { status: 200 });
}
