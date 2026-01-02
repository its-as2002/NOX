const { User } = require("../models/user.model");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const USER_SAFE_DATA = ["name", "emailId"];

/* ========================= SIGN UP ========================= */
exports.signUp = async (req, res) => {
	try {
		const { name, emailId, password } = req.body;

		if (!name || !emailId || !password) {
			return res.status(400).json({ message: "All fields required" });
		}

		if (!validator.isEmail(emailId)) {
			return res.status(400).json({ message: "Invalid emailId" });
		}

		if (!validator.isStrongPassword(password)) {
			return res.status(400).json({ message: "Weak password" });
		}

		const existingUser = await User.findOne({ emailId });
		if (existingUser) {
			return res.status(409).json({ message: "Email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			emailId,
			password: hashedPassword,
		});

		res.status(201).json({
			message: "Signup successful",
			userId: user._id,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

/* ========================= SIGN IN ========================= */
exports.signIn = async (req, res) => {
	try {
		const { emailId, password } = req.body;

		if (!validator.isEmail(emailId)) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const user = await User.findOne({ emailId }).select("+password");
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.cookie("loginToken", token, {
			httpOnly: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 1000,
			secure: process.env.NODE_ENV === "production",
		});

		const safeUser = {};
		USER_SAFE_DATA.forEach((field) => {
			safeUser[field] = user[field];
		});

		res.status(200).json({
			message: "User logged in successfully",
			user: safeUser,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

/* ========================= LOGOUT ========================= */
exports.logout = (req, res) => {
	res.cookie("loginToken", "", {
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		expires: new Date(0),
	});

	res.status(200).json({
		message: "User logged out successfully",
	});
};
