const { User } = require("../models/user.model");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../emails/emailHandler");
const { ENV } = require("../Utils/env");
const { cloudinary } = require("../Utils/cloudinary");

const USER_SAFE_DATA = ["name", "emailId", "profilePic"];

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

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await new User({
			name,
			emailId,
			password: hashedPassword,
		});
		await user.save();
		if (user) {
			const token = await user.getJWT();
			res.cookie("loginToken", token, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 60 * 60 * 1000,
				secure: ENV.NODE_ENV === "production",
			});
			const safeUser = {};
			USER_SAFE_DATA.forEach((field) => {
				safeUser[field] = user[field];
			});

			res.status(201).json({
				message: "Signup successful",
				user: safeUser,
			});
			try {
				await sendWelcomeEmail(
					safeUser.name,
					safeUser.emailId,
					ENV.NODE_ENV === "production"
						? ENV.CLIENT_URL
						: "http://localhost:5173/"
				);
			} catch (error) {
				console.log("Error sending Welcome Email : " + error);
			}
		} else res.status(400).json({ message: "Invalid User data" });
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

		const user = await User.findOne({ emailId });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = await user.getJWT();
		res.cookie("loginToken", token, {
			httpOnly: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 1000,
			secure: ENV.NODE_ENV === "production",
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
		secure: ENV.NODE_ENV === "production",
		expires: new Date(0),
	});

	res.status(200).json({
		message: "User logged out successfully",
	});
};

exports.updateProfilePic = async (req, res) => {
	try {
		const user = req.user;
		const { profilePic, _id } = user;
		if (!profilePic) {
			return res.status(400).json({ message: "Profile Pic is required" });
		}
		const uploadResponse = await cloudinary.uploader.upload(profilePic);
		const updatedUser = await User.findOneAndUpdate(
			{ _id: _id },
			{ profilePic: uploadResponse.secure_url },
			{ new: true }
		);
		const safeUser = {};
		USER_SAFE_DATA.forEach((field) => {
			safeUser[field] = updatedUser[field];
		});
		safeUser.profilePic = updatedUser.profilePic;
		res.status(200).json({ user: safeUser });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};
