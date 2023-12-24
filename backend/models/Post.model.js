const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		desc: {
			type: String,
			required: true,
			unique: true,
		},
		photo: {
			type: String,
			required: false,
		},
		username: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		categories: [
			{
				tagId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Tag",
				},
				tagName: {
					type: String,
				},
			},
		],
		visits: { type: mongoose.Schema.Types.ObjectId, ref: "Visit" },
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
