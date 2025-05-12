import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    const { email, password } = await request.json();
    const user = await prisma.user.findFirst({
        where: {
            email: email,
            password: password
        }
    });
    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ user });
}