import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV } from "../Utils/env.js";
export const auth = async (req, res, next) => {
	try {
		const { loginToken } = req.cookies;
		if (!loginToken)
			return res
				.status(401)
				.json({ message: "Unauthorized access : Token missing" });
		const { userId } = jwt.verify(loginToken, ENV.JWT_SECRET);
		const user = await User.findById(userId).select("-password");
		if (!user)
			return res.status(401).json({ message: "Unauthorized :User not found" });
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			message: "Unauthorized: Invalid or expired token",
		});
	}
};
