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
    const emotionId = searchParams.get('emotionId');

    if (!emotionId) {
      return NextResponse.json(
        { error: 'emotionId is required' },
        { status: 400 }
      );
    }

    // Verify emotion belongs to user
    const emotion = await db.emotion.findUnique({
      where: { id: emotionId },
    });

    if (!emotion) {
      return NextResponse.json({ error: 'Emotion not found' }, { status: 404 });
    }

    if (emotion.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const actions = await db.action.findMany({
      where: { emotionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ actions });
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch actions' },
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

    const { emotionId, title, description, url } = await request.json();

    if (!emotionId || !title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'emotionId and title are required' },
        { status: 400 }
      );
    }

    // Verify emotion belongs to user
    const emotion = await db.emotion.findUnique({
      where: { id: emotionId },
    });

    if (!emotion) {
      return NextResponse.json({ error: 'Emotion not found' }, { status: 404 });
    }

    if (emotion.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const action = await db.action.create({
      data: {
        emotionId,
        title: title.trim(),
        description: description?.trim() || null,
        url: url?.trim() || null,
      },
    });

    return NextResponse.json({ action }, { status: 201 });
  } catch (error) {
    console.error('Error creating action:', error);
    return NextResponse.json(
      { error: 'Failed to create action' },
      { status: 500 }
    );
  }
}

