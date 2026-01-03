const express = require("express");
const { login, signUp, logout } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", login);

router.post("/signUp", signUp);

router.post("/logout", logout);

module.exports = router;
