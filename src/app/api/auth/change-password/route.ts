import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import AdminConfig from '@/models/AdminConfig';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'You must be logged in to change your password' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
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

    // Hash the new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update the stored hash
    adminConfig.passwordHash = newHash;
    await adminConfig.save();

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { message: 'An error occurred while changing the password' },
      { status: 500 }
    );
  }
} 