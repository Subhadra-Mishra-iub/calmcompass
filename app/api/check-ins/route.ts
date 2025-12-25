import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, emotionId, notes, actionIds } = await request.json();

    if (!emotionId) {
      return NextResponse.json(
        { error: 'emotionId is required' },
        { status: 400 }
      );
    }

    // Verify user
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify emotion belongs to user
    const emotion = await db.emotion.findUnique({
      where: { id: emotionId },
    });

    if (!emotion || emotion.userId !== session.user.id) {
      return NextResponse.json({ error: 'Emotion not found' }, { status: 404 });
    }

    // Create check-in
    const checkIn = await db.checkIn.create({
      data: {
        userId: session.user.id,
        emotionId,
        notes: notes?.trim() || null,
        checkInActions: {
          create: (actionIds || []).map((actionId: string) => ({
            actionId,
            completed: true,
          })),
        },
      },
      include: {
        emotion: true,
        checkInActions: {
          include: {
            action: true,
          },
        },
      },
    });

    return NextResponse.json({ checkIn }, { status: 201 });
  } catch (error) {
    console.error('Error creating check-in:', error);
    return NextResponse.json(
      { error: 'Failed to create check-in' },
      { status: 500 }
    );
  }
}

