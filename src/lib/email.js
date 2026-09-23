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
