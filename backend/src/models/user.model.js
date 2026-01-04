import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ENV } from "../Utils/env.js";
const userSchema = new mongoose.Schema(
	{
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
		profilePic: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);
userSchema.methods.getJWT = async function () {
	const user = this;
	const token = jwt.sign({ userId: user._id }, ENV.JWT_SECRET, {
		expiresIn: "7d",
	});
	return token;
};
export const User = mongoose.model("User", userSchema);
