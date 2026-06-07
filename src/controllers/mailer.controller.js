import nodemailer from "nodemailer";
import dns from "dns";

export const sendMail = async (to, subject, text) => {
    console.log("📧 [MAILER] Attempting to send email");
    console.log("   TO:", to);
    console.log("   FROM:", process.env.EMAIL);
    console.log("   PASS EXISTS:", !!process.env.EMAIL_PASS);

    // Try direct IPv4 address as fallback for Render environment
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = process.env.SMTP_PORT || 465;
    
    console.log("   SMTP HOST:", smtpHost);
    console.log("   SMTP PORT:", smtpPort);

    // Create fresh transporter each call to avoid stale connections
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true,  
        family: 4,        // Force IPv4
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS   // must be a Gmail App Password (not your login password)
        },
        tls: {
            rejectUnauthorized: false      // avoids cert errors in some environments
        },
        // Additional connection options for cloud environments
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
    });

    try {
        console.log("   🔍 Verifying SMTP connection...");
        await transporter.verify();
        console.log("   ✅ SMTP connection verified");

        const info = await transporter.sendMail({
            from: `"VidStream" <${process.env.EMAIL}>`,
            to,
            subject,
            text
        });
        console.log("   ✅ Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.log("   ❌ Email error:", error.message);
        console.log("   Error code:", error.code);
        if (error.code === 'ESOCKET') {
            console.log("   💡 This is likely an IPv6/IPv4 network issue");
            console.log("   💡 Try setting SMTP_HOST=74.125.68.109 in Render env vars");
        }
        throw error;   // propagate so caller can handle it
    }
};
