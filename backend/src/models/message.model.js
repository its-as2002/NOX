import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			maxlength: 2000,
			trim: true,
		},
		image: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);
messageSchema.pre("save", function (next) {
	const user = this;
	if (user.senderId.equals(user.receiverId))
		throw new Error("You cannot send message to yourself");
	next();
});
export const Message = mongoose.model("Message", messageSchema);
