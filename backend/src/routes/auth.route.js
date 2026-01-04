const express = require("express");
const {
	signIn,
	signUp,
	logout,
	updateProfilePic,
} = require("../controllers/auth.controller");
const { auth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/signIn", signIn);

router.post("/signUp", signUp);

router.post("/logout", logout);

router.patch("/updateProfilePic", auth, updateProfilePic);

router.get("/check", auth, (req, res) => {
	res.status(200).json({ user: req.user });
});

module.exports = router;
