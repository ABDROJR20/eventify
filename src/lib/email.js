import nodemailer from "nodemailer";

// Initialize Gmail transporter with credentials from .env
function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.warn("EMAIL_USER or EMAIL_PASSWORD not set in environment variables.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user || "hafizabdullah.munawar786@gmail.com",
      pass: pass || "nikbytlkemetvqyf",
    },
  });
}

/**
 * Send an OTP email for password reset
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit verification code
 * @param {string} recipientName - Optional recipient name
 */
export async function sendOtpEmail(toEmail, otp, recipientName = "Eventify Member") {
  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Your Password - Eventify</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0b0f19;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 540px;
          margin: 40px auto;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          padding: 36px 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #ffffff;
        }
        .header p {
          margin: 6px 0 0 0;
          font-size: 14px;
          color: #bfdbfe;
          font-weight: 500;
        }
        .body {
          padding: 36px 32px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 700;
          color: #f3f4f6;
          margin-bottom: 16px;
        }
        .text {
          font-size: 15px;
          line-height: 1.6;
          color: #9ca3af;
          margin-bottom: 28px;
        }
        .otp-box {
          background: #1e293b;
          border: 2px dashed #3b82f6;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          margin-bottom: 28px;
        }
        .otp-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #60a5fa;
          margin-bottom: 8px;
        }
        .otp-code {
          font-size: 38px;
          font-weight: 900;
          letter-spacing: 8px;
          color: #ffffff;
          font-family: monospace, Courier, monospace;
        }
        .timer-badge {
          display: inline-block;
          margin-top: 12px;
          padding: 4px 12px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
        }
        .security-notice {
          background: #182234;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          border-radius: 8px;
          font-size: 13px;
          color: #d1d5db;
          line-height: 1.5;
        }
        .footer {
          padding: 24px 32px;
          border-top: 1px solid #1f2937;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        .footer a {
          color: #3b82f6;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Eventify</h1>
          <p>Security & Account Recovery</p>
        </div>
        <div class="body">
          <div class="greeting">Hello, ${recipientName}!</div>
          <div class="text">
            We received a request to reset the password for your Eventify account. Use the one-time verification code below to authorize your password change.
          </div>
          
          <div class="otp-box">
            <div class="otp-label">Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="timer-badge">⏱️ Expires in 10 minutes</div>
          </div>
          
          <div class="security-notice">
            <strong>Security Warning:</strong> If you did not request this code, please ignore this email or contact support immediately. Never share this code with anyone.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Eventify Platforms Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"Eventify Security" <${process.env.EMAIL_USER || "hafizabdullah.munawar786@gmail.com"}>`,
    to: toEmail,
    subject: `[${otp}] Eventify Password Reset Code`,
    text: `Your Eventify verification code is: ${otp}. It expires in 10 minutes. If you did not request this, please ignore this email.`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}

/**
 * Send a broadcast announcement email to attendees
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} messageContent - Body content of the broadcast
 * @param {string} eventTitle - Title of the event
 * @param {string} organizerName - Name of the organizer sending the broadcast
 */
export async function sendBroadcastEmail({
  to,
  subject,
  messageContent,
  eventTitle = "Eventify Event",
  organizerName = "Event Organizer",
}) {
  const transporter = getTransporter();
  const recipients = Array.isArray(to) ? to.join(", ") : to;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0b0f19;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 580px;
          margin: 40px auto;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 900;
          color: #ffffff;
        }
        .header p {
          margin: 6px 0 0 0;
          font-size: 14px;
          color: #bfdbfe;
        }
        .body {
          padding: 32px;
        }
        .event-badge {
          display: inline-block;
          background: rgba(37, 99, 235, 0.15);
          border: 1px solid #3b82f6;
          color: #60a5fa;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .msg-text {
          font-size: 15px;
          line-height: 1.7;
          color: #e5e7eb;
          white-space: pre-wrap;
          background: #1e293b;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #334155;
        }
        .footer {
          padding: 20px 32px;
          border-top: 1px solid #1f2937;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Event Update & Announcement</h1>
          <p>Message from ${organizerName}</p>
        </div>
        <div class="body">
          <div class="event-badge">📍 Event: ${eventTitle}</div>
          <div class="msg-text">${messageContent}</div>
        </div>
        <div class="footer">
          Sent via Eventify Platform &bull; &copy; ${new Date().getFullYear()} Eventify Inc.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${organizerName} via Eventify" <${process.env.EMAIL_USER || "hafizabdullah.munawar786@gmail.com"}>`,
      to: recipients,
      subject: `[${eventTitle}] ${subject}`,
      text: messageContent,
      html: htmlContent,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending broadcast email:", error);
    // Don't fail the API call if SMTP fails, return graceful simulated delivery
    return { success: true, simulated: true, note: error.message };
  }
}

/**
 * Send an event registration ticket confirmation email with QR pass
 */
export async function sendTicketEmail({
  toEmail,
  attendeeName,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  ticketType = "Standard",
  ticketCode,
  amount,
}) {
  const transporter = getTransporter();
  const verifyUrl = `https://eventify-tawny-one.vercel.app/verify-ticket?ticket=${encodeURIComponent(ticketCode)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verifyUrl)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Ticket for ${eventTitle}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0b0f19;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 580px;
          margin: 40px auto;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
          background: linear-gradient(135deg, #10b981, #2563eb);
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 900;
          color: #ffffff;
        }
        .header p {
          margin: 6px 0 0 0;
          font-size: 14px;
          color: #d1fae5;
        }
        .body {
          padding: 32px;
        }
        .ticket-card {
          background: #1e293b;
          border: 1px dashed #3b82f6;
          border-radius: 18px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }
        .ticket-code {
          font-family: monospace;
          font-size: 18px;
          font-weight: 800;
          color: #60a5fa;
          letter-spacing: 2px;
          margin-top: 8px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #334155;
          font-size: 14px;
        }
        .info-label {
          color: #9ca3af;
          font-weight: 600;
        }
        .info-value {
          color: #f3f4f6;
          font-weight: 700;
        }
        .footer {
          padding: 20px 32px;
          border-top: 1px solid #1f2937;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Registration Confirmed! 🎉</h1>
          <p>We look forward to seeing you at the event.</p>
        </div>
        <div class="body">
          <p style="font-size: 16px; color: #f3f4f6; margin-bottom: 20px;">
            Hi <strong>${attendeeName}</strong>,<br/>
            Your registration for <strong>${eventTitle}</strong> is confirmed.
          </p>

          <div class="ticket-card">
            <div style="margin-bottom: 16px;">
              <img src="${qrUrl}" alt="QR Pass" style="border-radius: 12px; background: white; padding: 8px; max-width: 160px;" />
            </div>
            <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Ticket Code</div>
            <div class="ticket-code">${ticketCode}</div>
          </div>

          <div style="margin-bottom: 24px;">
            <div class="info-row">
              <span class="info-label">Event</span>
              <span class="info-value">${eventTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date & Time</span>
              <span class="info-value">${eventDate} • ${eventTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Venue</span>
              <span class="info-value">${eventLocation}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Ticket Tier</span>
              <span class="info-value">${ticketType}</span>
            </div>
            <div class="info-row" style="border-bottom: none;">
              <span class="info-label">Amount Paid</span>
              <span class="info-value">${amount}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          Eventify Ticketing &bull; Present this QR code at venue check-in.
        </div>
      </div>
    </body>
    </html>
  `;

  const plainText = `
Your Eventify Ticket Confirmation
--------------------------------
Event: ${eventTitle}
Date & Time: ${eventDate} at ${eventTime}
Location: ${eventLocation}
Ticket Tier: ${ticketType}
Ticket Code: ${ticketCode}
Amount: ${amount}

Access your digital QR ticket pass here:
${verifyUrl}

Present your digital pass or QR code at venue entrance.
Eventify Ticketing Platform.
`;

  try {
    const senderEmail = process.env.EMAIL_USER || "hafizabdullah.munawar786@gmail.com";
    const info = await transporter.sendMail({
      from: `"Eventify Tickets" <${senderEmail}>`,
      to: toEmail,
      replyTo: senderEmail,
      subject: `Ticket Confirmed: ${eventTitle} [Pass ${ticketCode}]`,
      text: plainText.trim(),
      html: htmlContent,
      headers: {
        "X-Mailer": "Eventify Ticketing Service",
        "X-Priority": "1",
        "Importance": "high",
      },
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending ticket email:", error);
    return { success: true, simulated: true, note: error.message };
  }
}

/**
 * Send an official team invitation email with specific role and assigned authorities
 */
export async function sendTeamInviteEmail({
  toEmail,
  inviteeName = "Team Member",
  organizerName = "Event Organizer",
  eventTitle = "Event",
  roleTitle = "Event Moderator",
  permissions = {},
  inviteUrl = "https://eventify-tawny-one.vercel.app/auth",
}) {
  const transporter = getTransporter();

  // Format list of assigned authorities
  const authoritiesList = [];
  if (permissions.canCheckIn) authoritiesList.push("Entrance QR Ticket Check-in (Gate Scanner Desk)");
  if (permissions.canViewAttendees) authoritiesList.push("Access Guestlist & Attendee Information");
  if (permissions.canEditEvent) authoritiesList.push("Edit Event Schedule & Logistics");
  if (permissions.canSendBroadcast) authoritiesList.push("Send Announcements & Broadcast Notifications");
  if (permissions.canViewRevenue) authoritiesList.push("View Ticket Sales & Revenue Analytics");

  const authoritiesHtml = authoritiesList.length > 0
    ? authoritiesList.map(auth => `
        <li style="margin-bottom: 8px; color: #e2e8f0; font-size: 14px; font-weight: 600;">
          <span style="color: #10b981; font-weight: bold; margin-right: 6px;">✓</span> ${auth}
        </li>
      `).join("")
    : `<li style="color: #94a3b8; font-size: 13px;">View-only event member access</li>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Event Team Invitation - Eventify</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0b0f19;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 560px;
          margin: 40px auto;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
          background: linear-gradient(135deg, #0284c7, #2563eb);
          padding: 36px 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #ffffff;
        }
        .content {
          padding: 36px 32px;
        }
        .role-box {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 20px;
          margin: 24px 0;
        }
        .role-title {
          font-size: 18px;
          font-weight: 800;
          color: #38bdf8;
          margin: 0 0 4px 0;
        }
        .event-name {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 600;
        }
        .btn {
          display: block;
          width: 100%;
          text-align: center;
          background: #2563eb;
          color: #ffffff !important;
          padding: 16px 24px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
          box-sizing: border-box;
          margin-top: 28px;
        }
        .footer {
          padding: 20px 32px;
          background: #0b0f19;
          border-top: 1px solid #1f2937;
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Eventify</h1>
          <p style="margin: 8px 0 0; color: #e0f2fe; font-size: 15px; font-weight: 600;">Event Team Invitation</p>
        </div>
        <div class="content">
          <p style="font-size: 16px; line-height: 1.6; color: #e2e8f0; margin-top: 0;">
            Hi <strong>${inviteeName}</strong>,
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #94a3b8;">
            <strong>${organizerName}</strong> has invited you to join their event management team on Eventify.
          </p>

          <div class="role-box">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 800; margin-bottom: 6px;">Assigned Position</div>
            <div class="role-title">${roleTitle}</div>
            <div class="event-name">Event: ${eventTitle}</div>
          </div>

          <div style="margin: 20px 0;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px;">
              Your Designated Authorities:
            </div>
            <ul style="padding-left: 20px; margin: 0; list-style-type: none;">
              ${authoritiesHtml}
            </ul>
          </div>

          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-top: 24px;">
            Note: Your access is limited strictly to the authorities granted above by the event organizer.
          </p>

          <a href="${inviteUrl}" class="btn">
            Accept & Access Event Portal →
          </a>
        </div>
        <div class="footer">
          Eventify Team Permissions &bull; Sent on behalf of ${organizerName}.
        </div>
      </div>
    </body>
    </html>
  `;

  const plainText = `
Event Team Invitation from ${organizerName}
------------------------------------------
Hello ${inviteeName},

${organizerName} has invited you to join their event management team on Eventify.
Assigned Position: ${roleTitle}
Event: ${eventTitle}

Designated Authorities:
${authoritiesList.length > 0 ? authoritiesList.map(a => `- ${a}`).join("\n") : "- View-only event member access"}

Accept and access the event portal using this link:
${inviteUrl}

Eventify Team Management.
`;

  try {
    const senderEmail = process.env.EMAIL_USER || "hafizabdullah.munawar786@gmail.com";
    const info = await transporter.sendMail({
      from: `"${organizerName} via Eventify" <${senderEmail}>`,
      to: toEmail,
      replyTo: senderEmail,
      subject: `Team Invitation: ${roleTitle} for "${eventTitle}"`,
      text: plainText.trim(),
      html: htmlContent,
      headers: {
        "X-Mailer": "Eventify Team Roles Service",
        "X-Priority": "1",
        "Importance": "high",
      },
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending team invite email:", error);
    return { success: true, simulated: true, note: error.message };
  }
}


