import { NextResponse } from 'next/server';
import { deleteSession } from '@/app/[locale]/lib/session';

export async function DELETE() {
    await deleteSession();
    return NextResponse.json({ success: true }, { status: 200 });
}
