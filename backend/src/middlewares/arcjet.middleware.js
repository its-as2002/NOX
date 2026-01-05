import { isSpoofedBot } from "@arcjet/inspect";
import { ajforUser, ajforGuests } from "../Utils/arcjet.js";
import jwt from "jsonwebtoken";
import { ENV } from "../Utils/env.js";
export const arcjetProtect = async (req, res, next) => {
	try {
		let decision;
		const { loginToken } = req.cookies;
		if (!loginToken) {
			decision = await ajforGuests.protect(req);
		} else {
			try {
				const { userId } = jwt.verify(loginToken, ENV.JWT_SECRET);
				decision = !userId
					? await ajforGuests.protect(req)
					: await ajforUser.protect(req, { userId: userId });
			} catch (error) {
				decision = await ajforGuests.protect(req);
			}
		}
		if (decision.isDenied()) {
			if (decision.reason.isRateLimit()) {
				return res.status(429).json({ error: "Too Many Requests" });
			}
			if (decision.reason.isBot()) {
				return res.status(403).json({ error: "No bots allowed" });
			}
			return res.status(403).json({ error: "Forbidden " });
		}

		if (decision.results.some(isSpoofedBot)) {
			return res.status(403).json({ error: "Forbidden : SpoofedBot Detected" });
		}

		next();
	} catch {
		return res.status(500).json({ error: "Arcjet middleware failure" });
	}
};
