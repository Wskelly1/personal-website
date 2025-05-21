import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { sendContactEmail } from '../../../lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received form data:', body);
    
    const { firstName, lastName, email, message } = body;

    // Validate input
    if (!firstName || !lastName || !email || !message) {
      console.log('Missing required fields:', { firstName, lastName, email, message });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to database
    try {
      await dbConnect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Create new contact submission
    try {
      const contact = await Contact.create({
        firstName,
        lastName,
        email,
        message,
      });
      console.log('Contact created successfully:', contact);

      // Send email notification
      const emailSent = await sendContactEmail({
        firstName,
        lastName,
        email,
        message,
      });

      if (!emailSent) {
        console.error('Failed to send email notification');
        // Continue with the response even if email fails
      }

      return NextResponse.json(
        { message: 'Message sent successfully', contact },
        { status: 201 }
      );
    } catch (createError) {
      console.error('Error creating contact:', createError);
      return NextResponse.json(
        { error: 'Failed to save contact information' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 