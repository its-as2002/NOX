const express = require("express");
const { signIn, signUp, logout } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signIn", signIn);

router.post("/signUp", signUp);

router.post("/logout", logout);

module.exports = router;
