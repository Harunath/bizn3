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
			from: `"BIZZ-NETWORK" <harunath04@gmail.com>`,
			to: email,
			subject: "Verify Your Email",
			html: `
        <h2>Your OTP Code</h2>
        <p>Use the following OTP code to verify your email:</p>
        <h3>${otp}</h3>
        <p>This code is valid for 10 minutes.</p>
      `,
		});
	} catch (error) {
		console.error("Error sending email:", error);
	}
};
