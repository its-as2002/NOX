const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);
module.exports = { User };
