const { Resend } = require("resend");
const { ENV } = require("./env");
exports.resendClient = new Resend(ENV.RESEND_API);
exports.sender = {
	name: ENV.SENDER_NAME,
	email: ENV.SENDER_EMAIL,
};
