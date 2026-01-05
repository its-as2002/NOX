import mongoose, { mongo } from "mongoose";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../Utils/cloudinary.js";

export const getAllContacts = async (req, res) => {
	try {
		const _id = req.user._id;
		const contacts = await User.find({ _id: { $ne: _id } }).select("-password");
		res.status(200).json({
			message: "All contacts available for chatting",
			contacts,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
export const getChatPartners = async (req, res) => {
	try {
		const { _id } = req.user;
		const chats = await Message.find({
			$or: [{ senderId: _id }, { receiverId: _id }],
		})
			.populate("senderId", "name emailId profilePic")
			.populate("receiverId", "name emailId profilePic");

		if (!chats.length)
			return res.status(200).json({
				message: "No chats found",
				chats,
			});

		let uniqueUsers = {};
		chats.forEach((message) => {
			const partner = message.senderId._id.equals(_id)
				? message.receiverId
				: message.senderId;
			uniqueUsers[partner._id] = partner;
		});

		uniqueUsers = Object.values(uniqueUsers);
		return res.status(200).json({ chats: uniqueUsers });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getMessageByUserID = async (req, res) => {
	try {
		const user = req.user;
		const userId = user._id;
		const { receiverId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(receiverId))
			return res.status(404).json({ message: "Invalid receiver Id" });

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: receiverId },
				{
					senderId: receiverId,
					receiverId: userId,
				},
			],
		});

		return res.status(200).json({ messages });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
export const sendMessage = async (req, res) => {
	try {
		const { _id: senderId } = req.user;
		console.log(senderId);
		const { receiverId } = req.params;
		const { text, image } = req.body;
		if (!mongoose.Types.ObjectId.isValid(receiverId))
			return res.status(400).json({ message: "Invalid receiver Id" });
		if (!text && !image) {
			return res.status(400).json({ message: "Missing input" });
		}

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		res.status(201).json(newMessage);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
