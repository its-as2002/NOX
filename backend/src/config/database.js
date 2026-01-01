const mongoose = require("mongoose");

const dbConnect = async () => {
	await mongoose.connect(process.env.MONGODB_URI);
	return "Connection with MongoDB Established ✅";
};

module.exports = { dbConnect };
