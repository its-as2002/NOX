const mongoose = require("mongoose");
const { ENV } = require("../Utils/env");

const dbConnect = async () => {
	await mongoose.connect(ENV.MONGODB_URI);
	return "Connection with MongoDB Established ✅";
};

module.exports = { dbConnect };
