import twilio from "twilio";

const VerifyPhone = async ({ phone }: { phone: string }) => {
	try {
		const client = twilio(
			process.env.TWILIOACCOUNTSID!,
			process.env.TWILIOAUTHTOKEN!
		);

		const verification = await client.verify.v2
			.services("VAc5c39348f2c2f03b6d813eab3973ce07")
			.verifications.create({ to: phone, channel: "sms" });

		console.log("Verification SID:", verification.sid);
		return true;
	} catch (error) {
		console.error("Twilio verification error:", error);
		return false;
	}
};

export default VerifyPhone;
