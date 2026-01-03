const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ENV } = require("../Utils/env");
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		maxlength: 40,
		trim: true,
	},
	emailId: {
		type: String,
		lowercase: true,
		required: true,
		unique: true,
		trim: true,
		validate(value) {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

			if (!emailRegex.test(value)) {
				throw new Error("Invalid Email Format");
			}
		},
	},
	password: {
		type: String,
		required: true,
	},
});
userSchema.methods.getJWT = async function () {
	const user = this;
	const token = jwt.sign({ userId: user._id }, ENV.JWT_SECRET, {
		expiresIn: "1h",
	});
	return token;
};
const User = mongoose.model("User", userSchema);
module.exports = { User };
