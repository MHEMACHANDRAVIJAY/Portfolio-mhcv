const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({ status: 'MHCV Email Gateway Serverless Function Active' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
    }

    const { name, email, to, message } = body || {};
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields (name, email, message)' });
    }

    const formattedTimestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    }) + ' (IST)';

    const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#f8fafc;">
  <table width="100%" style="background:#080c14;padding:40px 16px;"><tr><td align="center">
    <table width="100%" style="max-width:600px;background:#0f1626;border:2px solid #1e293b;border-radius:28px;overflow:hidden;box-shadow:0 0 30px rgba(0,229,255,0.15);">
      <tr><td height="6" style="background:linear-gradient(90deg,#6366f1,#8b5cf6);"></td></tr>
      <tr><td style="padding:40px 40px 24px;">
        <span style="font-size:11px;font-weight:800;color:#6366f1;letter-spacing:3px;text-transform:uppercase;">✦ NEW INQUIRY</span>
        <h1 style="margin:8px 0 0;font-size:26px;font-weight:900;color:#fff;">New message from ${name}</h1>
      </td></tr>
      <tr><td style="padding:0 40px 24px;">
        <table width="100%" style="background:#172033;border:1px solid #2d3b55;border-radius:20px;padding:24px;">
          <tr><td><span style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Email</span><br>
            <a href="mailto:${email}" style="color:#6366f1;font-size:15px;font-weight:700;">${email}</a></td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 40px 30px;">
        <table width="100%" style="background:#0a0f1d;border:1px solid #1e293b;border-radius:20px;">
          <tr><td style="padding:28px;font-size:15px;line-height:1.7;color:#cbd5e1;white-space:pre-wrap;">${message}</td></tr>
        </table>
      </td></tr>
      <tr><td align="center" style="background:#06090f;padding:24px;border-top:1px solid #1e293b;">
        <span style="font-size:9px;font-weight:800;color:#475569;letter-spacing:4px;text-transform:uppercase;">MHCV PORTFOLIO — ${formattedTimestamp}</span>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : null;

    if (!emailUser || !emailPass) {
        console.error('[SMTP ERROR] EMAIL_USER or EMAIL_PASS environment variable is missing.');
        return res.status(500).json({
            error: 'Email service configuration error',
            details: 'EMAIL_USER or EMAIL_PASS environment variable is not set.'
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user: emailUser, pass: emailPass },
        });

        const recipient = (to && typeof to === 'string' && to.trim()) ? to.trim() : emailUser;
        await transporter.sendMail({
            from: `"MHCV Gateway" <${emailUser}>`,
            to: recipient,
            replyTo: email,
            subject: `⚡ [UPLINK] Message from ${name}`,
            text: `From: ${name} <${email}>\n\n${message}`,
            html: htmlContent
        });

        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        console.error('[SMTP ERROR]', err);
        return res.status(500).json({
            error: 'Failed to send email',
            details: err && err.message ? err.message : 'SMTP Authentication failed'
        });
    }
};
