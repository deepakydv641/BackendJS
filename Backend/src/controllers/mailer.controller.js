import nodemailer from "nodemailer";
import dns from "dns";

export const sendMail = async (to, subject, text) => {
    // Try direct IPv4 address as fallback for Render environment
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT) || 465;

    // Create fresh transporter each call to avoid stale connections
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,  // true for 465, false for 587
        family: 4,                 // Force IPv4
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS   // must be a Gmail App Password (not your login password)
        },
        tls: {
            rejectUnauthorized: false      // avoids cert errors in some environments
        },
        // Additional connection options for cloud environments
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });

    try {
        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"VidStream" <${process.env.EMAIL}>`,
            to,
            subject,
            text
        });
        return info;
    } catch (error) {
        console.log('error in sendMail:', error.message);
        throw error;
    }
};
