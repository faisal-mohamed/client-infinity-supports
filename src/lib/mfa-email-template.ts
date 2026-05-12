/**
 * MFA OTP Email Template
 */
export function createMfaOtpEmailHTML(name: string, code: string, expiryMinutes: number = 5): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Verification Code</title>
</head>
<body style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;background-color:#f8f9fa;">
  <div style="background:white;padding:40px;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
    <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #e9ecef;">
      <div style="font-size:24px;font-weight:bold;color:#1e3a5f;margin-bottom:10px;">Infinity Supports WA</div>
      <h1 style="color:#1f2937;font-size:24px;margin:0;">Login Verification</h1>
    </div>
    <div style="margin:30px 0;">
      <p>Hello <strong>${name}</strong>,</p>
      <p>A login attempt was made to your admin account. Enter the code below to complete sign-in:</p>
      <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%);color:white;font-size:36px;font-weight:bold;text-align:center;padding:24px;border-radius:8px;letter-spacing:12px;margin:30px 0;font-family:'Courier New',monospace;">
        ${code}
      </div>
      <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:20px 0;">
        <p style="margin:0;font-size:14px;color:#374151;"><strong>⏱ Expires in ${expiryMinutes} minutes</strong></p>
      </div>
      <div style="background:#fef3cd;border:1px solid #fbbf24;color:#92400e;padding:15px;border-radius:8px;margin:20px 0;font-size:14px;">
        <strong>⚠️ Security:</strong>
        <ul style="margin:8px 0 0;padding-left:20px;">
          <li>Never share this code with anyone</li>
          <li>Infinity Supports staff will never ask for this code</li>
          <li>If you did not attempt to log in, change your password immediately</li>
        </ul>
      </div>
    </div>
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e9ecef;text-align:center;color:#6b7280;font-size:12px;">
      <p>This is an automated security message. Do not reply.</p>
    </div>
  </div>
</body>
</html>`;
}
