import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS, // Google App Password
	},
});

export const sendVerificationEmail = async (email: string, otp: string) => {
	try {
		await transporter.sendMail({
			from: `"BIZ NETWORK" <hellobiznetworking@gmail.com>`,
			to: email,
			subject: "Verify Your Email",
			html: `
      <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; font-family: Arial, sans-serif; color: #333333; border: 1px solid #dddddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #d32f2f; margin: 0; font-size: 28px;">Biz Network<sup style="font-size: 14px; color: #555;">®</sup></h1>
          <p style="color: #555; font-size: 16px;">Empowering Professional Connections</p>
        </div>

        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">

        <h2 style="color: #111111;">Your OTP Code</h2>
        <p style="font-size: 16px;">Use the following OTP code to verify your email with <strong>Biz Network<sup style="font-size: 12px;">®</sup></strong>:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #1976d2; color: #ffffff; padding: 15px 30px; font-size: 24px; border-radius: 6px; letter-spacing: 2px;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #888;">This code is valid for <strong>10 minutes</strong>. If you didn’t request this, please ignore this email.</p>

        <div style="margin-top: 40px; font-size: 12px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} Biz Network<sup>®</sup>. All rights reserved.
        </div>
      </div>
      `,
		});
	} catch (error) {
		console.error("Error sending email:", error);
	}
};
