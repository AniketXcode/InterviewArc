import nodemailer from 'nodemailer';

export const sendInterviewReportEmail = async (userEmail, userName, finalScore, role, resumeLink = null) => {
  try {
    // We use a dummy transporter if no real env vars are provided, 
    // or standard SMTP config if provided by the user later.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"InterviewArc AI" <noreply@interviewarc.com>',
      to: userEmail,
      subject: `Your Interview Report is Ready - ${role}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #10b981;">Hello ${userName},</h2>
          <p>Your AI-guided mock interview for the <strong>${role}</strong> role has been successfully analyzed.</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #065f46;">Final Score: ${finalScore}/10</h3>
            <p style="margin: 0;">Log in to your Dashboard to view the complete breakdown of your Confidence, Communication, and Correctness metrics, along with detailed AI feedback per question.</p>
          </div>
          
          <a href="http://localhost:5173/history" style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 99px; font-weight: bold;">View Full Report</a>
          
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Keep up the practice!</p>
          <p style="font-size: 14px; color: #6b7280;">- The InterviewArc Team</p>
        </div>
      `,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const info = await transporter.sendMail(mailOptions);
      console.log('Report email sent:', info.messageId);
    } else {
      console.log('Nodemailer skipped: No SMTP_USER or SMTP_PASS configured in .env');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
