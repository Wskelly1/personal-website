import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ReadingList from '@/models/ReadingList';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();
    console.log('Updating reading list item:', { id, data });

    // Validate status if it's being updated
    if (data.status && !['Reading', 'Completed', 'Want to Read'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Add dateCompleted if status is being changed to Completed
    if (data.status === 'Completed') {
      data.dateCompleted = data.dateCompleted || new Date();
    }

    await dbConnect();
    const item = await ReadingList.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    console.log('Updated item:', item);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Reading list item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating reading list item:', error);
    return NextResponse.json(
      { error: 'Failed to update reading list item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await dbConnect();
    const item = await ReadingList.findByIdAndDelete(id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Reading list item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Reading list item deleted successfully' });
  } catch (error) {
    console.error('Error deleting reading list item:', error);
    return NextResponse.json(
      { error: 'Failed to delete reading list item' },
      { status: 500 }
    );
  }
} 