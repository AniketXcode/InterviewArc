import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT || 587),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendEmail = async ({ to, subject, html, logLabel }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`Nodemailer skipped: No SMTP_USER or SMTP_PASS configured in .env for ${logLabel}`);
      return;
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"InterviewArc AI" <noreply@interviewarc.com>',
      to,
      subject,
      html,
    });

    console.log(`${logLabel} email sent:`, info.messageId);
  } catch (error) {
    console.error(`Error sending ${logLabel} email:`, error);
  }
};

const getClientUrl = () =>
  process.env.CLIENT_URL || process.env.CLIENT_URLS?.split(",")?.[0]?.trim() || "http://localhost:5173";

export const getAdminNotificationEmails = () =>
  (process.env.ADMIN_NOTIFICATION_EMAILS || process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

export const sendWelcomeEmail = async (userEmail, userName = "there") => {
  await sendEmail({
    to: userEmail,
    subject: "Welcome to InterviewArc - your interview prep starts now",
    logLabel: "welcome",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1f2937;">
        <div style="background: linear-gradient(135deg, #10b981, #06b6d4); padding: 28px; border-radius: 18px 18px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 26px;">Welcome to InterviewArc, ${userName}!</h1>
          <p style="margin: 12px 0 0; line-height: 1.6;">Your AI interview prep workspace is ready.</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 28px; border-radius: 0 0 18px 18px;">
          <p style="line-height: 1.7;">You can now practice realistic mock interviews, get adaptive follow-up questions, and track your progress through detailed reports.</p>
          <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; padding: 18px; border-radius: 12px; margin: 22px 0;">
            <strong>Good first step:</strong>
            <p style="margin: 8px 0 0; line-height: 1.6;">Start one short mock interview and review the report before your next real round.</p>
          </div>
          <a href="${getClientUrl()}/interview" style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 22px; text-decoration: none; border-radius: 999px; font-weight: bold;">Start Practice</a>
          <p style="margin-top: 28px; font-size: 14px; color: #6b7280;">Keep practicing,<br />The InterviewArc Team</p>
        </div>
      </div>
    `,
  });
};

export const sendRewardClaimAdminEmail = async ({ user, item, order = null, shippingAddress = null }) => {
  const recipients = getAdminNotificationEmails();

  if (!recipients.length) {
    console.log("Reward claim admin email skipped: ADMIN_EMAILS or ADMIN_NOTIFICATION_EMAILS not configured.");
    return;
  }

  const address = shippingAddress
    ? `${shippingAddress.fullName}, ${shippingAddress.phone}, ${shippingAddress.addressLine1}${shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}, ${shippingAddress.country}`
    : "No shipping address required";

  await sendEmail({
    to: recipients.join(","),
    subject: `Reward claimed: ${item?.title || "InterviewArc reward"}`,
    logLabel: "reward claim admin",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
        <h2 style="color: #0f172a;">New reward claim</h2>
        <p>A user claimed a reward in InterviewArc.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 18px;">
          <tr><td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>User</strong></td><td style="padding: 10px; border: 1px solid #e5e7eb;">${user?.name || "Unknown"}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding: 10px; border: 1px solid #e5e7eb;">${user?.email || "Unknown"}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Reward</strong></td><td style="padding: 10px; border: 1px solid #e5e7eb;">${item?.title || "Unknown reward"}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Category</strong></td><td style="padding: 10px; border: 1px solid #e5e7eb;">${item?.category || "Unknown"}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Coins spent</strong></td><td style="padding: 10px; border: 1px solid #e5e7eb;">${item?.coinCost ?? 0}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Order number</strong></td><td style="padding: 10px; border: 1px solid #e5e7eb;">${order?.orderNumber || "Not applicable"}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Shipping</strong></td><td style="padding: 10px; border: 1px solid #e5e7eb;">${address}</td></tr>
        </table>
        <p style="margin-top: 22px; font-size: 14px; color: #6b7280;">Open the admin reward orders dashboard for physical order processing.</p>
      </div>
    `,
  });
};

export const sendInterviewReportEmail = async (userEmail, userName, finalScore, role, resumeLink = null) => {
  try {
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
      const transporter = createTransporter();
      const info = await transporter.sendMail(mailOptions);
      console.log('Report email sent:', info.messageId);
    } else {
      console.log('Nodemailer skipped: No SMTP_USER or SMTP_PASS configured in .env');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
