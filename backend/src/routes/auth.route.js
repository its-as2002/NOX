const express = require("express");
const router = express.Router();

router.post("/signIn", (req, res) => {
	res.send("signIn route");
});

router.post("/signOut", (req, res) => {
	res.send("signUp route");
});

router.post("/logout", (req, res) => {
	res.send("/logout");
});

module.exports = router;
