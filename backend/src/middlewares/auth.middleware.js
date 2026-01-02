const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const auth = async (req, res, next) => {
	try {
		const { loginToken } = req.cookies;
		if (!loginToken)
			return res
				.status(401)
				.json({ message: "Unauthorized access : Token missing" });
		const { userId } = jwt.verify(loginToken, process.env.JWT_SECRET);
		const user = await User.findById(userId);
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

module.exports = { auth };
