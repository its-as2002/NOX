import express from "express";
import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";
import { ENV } from "./Utils/env.js";
import { dbConnect } from "./config/database.js";
import authRouter from "./routes/auth.route.js";
import { arcjetProtect } from "./middlewares/arcjet.middleware.js";
const app = express();
const PORT = ENV.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(arcjetProtect);
app.use("/api/auth", authRouter);

const __dirname = path.resolve();
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
		console.log("Connection Failed with MongoDB ❌", err);
	});
