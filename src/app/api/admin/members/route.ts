import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, callsign, misc } = body;

    if (!name || !callsign) {
      return NextResponse.json(
        { error: 'Name and callsign are required' },
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: {
        name,
        callsign,
        misc,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
