import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify emotion belongs to user
    const emotion = await db.emotion.findUnique({
      where: { id },
    });

    if (!emotion) {
      return NextResponse.json({ error: 'Emotion not found' }, { status: 404 });
    }

    if (emotion.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.emotion.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting emotion:', error);
    return NextResponse.json(
      { error: 'Failed to delete emotion' },
      { status: 500 }
    );
  }
}


