import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const filePath = path.join(process.cwd(), 'src', 'data', 'about.json');

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return new NextResponse('Bio updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error updating bio:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'about.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return new NextResponse(data, { status: 200 });
  } catch (error) {
    console.error('Error reading bio:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 