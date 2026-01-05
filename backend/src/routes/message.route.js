import express from "express";
const router = express.Router();
import { auth } from "../middlewares/auth.middleware.js";
import {
	getAllContacts,
	getChatPartners,
	getMessageByUserID,
	sendMessage,
} from "../controllers/message.controller.js";

router.use(auth);
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:receiverId", getMessageByUserID);
router.post("/send/:receiverId", sendMessage);

export default router;
