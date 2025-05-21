import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import AdminConfig from '@/models/AdminConfig';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'You must be logged in to change your email' },
        { status: 401 }
      );
    }

    const { currentPassword, newEmail } = await req.json();

    if (!currentPassword || !newEmail) {
      return NextResponse.json(
        { message: 'Current password and new email are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the current admin configuration
    const adminConfig = await AdminConfig.findOne({ key: 'credentials' });
    
    if (!adminConfig) {
      return NextResponse.json(
        { message: 'Admin account not configured' },
        { status: 500 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminConfig.passwordHash);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update the email
    adminConfig.email = newEmail;
    await adminConfig.save();

    return NextResponse.json(
      { message: 'Email updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error changing email:', error);
    return NextResponse.json(
      { message: 'An error occurred while changing the email' },
      { status: 500 }
    );
  }
} 