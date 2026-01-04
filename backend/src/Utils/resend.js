import { Resend } from "resend";
import { ENV } from "./env.js";
export const resendClient = new Resend(ENV.RESEND_API);
export const sender = {
	name: ENV.SENDER_NAME,
	email: ENV.SENDER_EMAIL,
};
