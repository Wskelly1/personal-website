import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ReadingList from '@/models/ReadingList';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const items = await ReadingList.find().sort({ dateAdded: -1 });
    console.log('Retrieved reading list items:', items);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching reading list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading list' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (data.status && !['Reading', 'Completed', 'Want to Read'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    // Add dateCompleted if status is Completed
    if (data.status === 'Completed' && !data.dateCompleted) {
      data.dateCompleted = new Date();
    }

    const item = await ReadingList.create(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating reading list item:', error);
    return NextResponse.json(
      { error: 'Failed to create reading list item' },
      { status: 500 }
    );
  }
} 