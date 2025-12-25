import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    // Verify user can only access their own emotions
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const emotions = await db.emotion.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ emotions });
  } catch (error) {
    console.error('Error fetching emotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emotions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if emotion with this name already exists for user
    const existing = await db.emotion.findFirst({
      where: {
        userId: session.user.id,
        name: name.trim(),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Emotion with this name already exists' },
        { status: 400 }
      );
    }

    const emotion = await db.emotion.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
      },
    });

    return NextResponse.json({ emotion }, { status: 201 });
  } catch (error) {
    console.error('Error creating emotion:', error);
    return NextResponse.json(
      { error: 'Failed to create emotion' },
      { status: 500 }
    );
  }
}

