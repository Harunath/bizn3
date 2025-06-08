import twilio from "twilio";

const VerifyPhoneCheck = async ({
	phone,
	code,
}: {
	phone: string;
	code: string;
}) => {
	try {
		const client = twilio(
			process.env.TWILIOACCOUNTSID,
			process.env.TWILIOAUTHTOKEN
		);

		const verification = await client.verify.v2
			.services("VAc5c39348f2c2f03b6d813eab3973ce07")
			.verificationChecks.create({ to: phone, code: code });

		console.log(verification.status);
		if (verification.status == "approved") return verification.valid;
		return false;
	} catch (error) {
		console.error("Twilio verification error:", error);
		return false;
	}
};

export default VerifyPhoneCheck;
