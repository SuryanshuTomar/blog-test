const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
	post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
	count: { type: Number, default: 0 },
});

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
