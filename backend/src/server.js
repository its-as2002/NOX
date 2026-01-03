const express = require("express");
require("dotenv").config();
const { ENV } = require("./Utils/env");
const { dbConnect } = require("./config/database");
const app = express();
const PORT = ENV.PORT || 3000;
const authRouter = require("./routes/auth.route");

app.use(express.json());
app.use("/api/auth", authRouter);
if (ENV.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
	});
}

dbConnect()
	.then((msg) => {
		console.log(msg);
		app.listen(PORT, () => {
			console.log(`Server is Listening🎧 at PORT : ${PORT} ✅`);
		});
	})
	.catch((err) => {
		console.log("Connection Failed with MongoDB ❌" + err);
	});
