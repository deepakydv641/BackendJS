import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
    // Create fresh transporter each call to avoid stale connections
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,  
        family: 4,        // SSL on port 465
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS   // must be a Gmail App Password (not your login password)
        },
        tls: {
            rejectUnauthorized: false      // avoids cert errors in some environments
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"VidStream" <${process.env.EMAIL}>`,
            to,
            subject,
            text
        });
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.log("Email error:", error);
        throw error;   // propagate so caller can handle it
    }
};
