const { resendClient, sender } = require("../Utils/resend");
const { emailTemplate } = require("./emailTemplate");

exports.sendWelcomeEmail = async (recieverName, recieversEmail, clientURL) => {
	const { data, error } = await resendClient.emails.send({
		from: `${sender.name} <${sender.email}>`,
		to: recieversEmail,
		subject: "Welcome to NOX Messenger 💬",
		html: emailTemplate(recieverName, clientURL),
	});
	if (error) {
		throw new Error(error.message);
	}
	console.log(`Welcome email sent successfully ${data}`);
};
