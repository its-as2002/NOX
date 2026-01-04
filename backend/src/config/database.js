import mongoose from "mongoose";
import { ENV } from "../Utils/env.js";

export const dbConnect = async () => {
	await mongoose.connect(ENV.MONGODB_URI);
	return "Connection with MongoDB Established ✅";
};
