const { Resend } = require("resend");
exports.resendClient = new Resend(process.env.RESEND_API);
exports.sender = {
	name: process.env.SENDER_NAME,
	email: process.env.SENDER_EMAIL,
};
