const express = require("express");
require("dotenv").config();
const { dbConnect } = require("./src/config/database");

const server = express();
const PORT = process.env.PORT || 3000;

dbConnect()
	.then((msg) => {
		console.log(msg);
		server.listen(PORT, () => {
			console.log(`Server is Listening🎧 at PORT ${PORT}: ✅`);
		});
	})
	.catch((err) => {
		console.log("Connection Failed with MongoDB ❌ " + err);
	});
