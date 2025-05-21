import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail({
  firstName,
  lastName,
  email,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'skelly.william036@gmail.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 10px 0;"><strong style="color: #1e40af;">Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 10px 0;"><strong style="color: #1e40af;">Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
            <h3 style="color: #1e40af; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; font-size: 14px; color: #64748b;">
            <p>This email was sent from your website's contact form.</p>
          </div>
        </div>
      `,
    });
    console.log('Resend result:', { data, error });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 