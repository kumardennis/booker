import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
        });
    }

    const { to, subject, text } = await req.json();

    if (!to || !subject || !text) {
        return new Response(
            JSON.stringify({ error: "Missing required fields" }),
            { status: 400 },
        );
    }

    try {
        // Create a transporter using your email service credentials
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.NEXT_PUBLIC_EMAIL_USER,
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.NEXT_PUBLIC_GOOGLE_REFRESH_TOKEN,
            },
        });

        // Define the email options
        const mailOptions = {
            from: process.env.NEXT_PUBLIC_EMAIL_USER, // Sender address
            to, // Recipient address
            subject, // Email subject
            text, // Email body
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return new Response(
            JSON.stringify({ message: "Email sent successfully" }),
            { status: 200 },
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: "Failed to send email", reason: error }),
            {
                status: 500,
            },
        );
    }
}
