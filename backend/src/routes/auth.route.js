import express from "express";
import { auth } from "../middlewares/auth.middleware.js";

import {
	signIn,
	signUp,
	logout,
	updateProfilePic,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login);

router.post("/signUp", signUp);

router.post("/logout", logout);

router.patch("/updateProfilePic", auth, updateProfilePic);

router.get("/check", auth, (req, res) => {
	res.status(200).json({ user: req.user });
});

export default router;
