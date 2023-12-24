const ObjectId = require("mongoose").Types.ObjectId;

// Models
const Tag = require("../models/Tag.model");
const Post = require("../models/Post.model");

const createTag = async (req, res) => {
	try {
		const { tagName } = req.body;

		if (!tagName) {
			return res.status(400).json({ error: "Tag name is required" });
		}

		const newTag = new Tag({ name: tagName });
		const savedTag = await newTag.save();

		res.status(201).json(savedTag);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getAllTags = async (req, res) => {
	try {
		const tags = await Tag.find().exec();
		res.status(200).json(tags);
	} catch (error) {
		console.error(error);
		res.status(500).json(error.message);
	}
};

const getCurrentTagPosts = async (req, res) => {
	try {
		const tagId = req.params.tagId;
		const posts = await Post.find({
			"categories.tagId": new ObjectId(tagId),
		}).exec();

		const totalCount = await Post.countDocuments({
			"categories.tagId": new ObjectId(tagId),
		});
		res.status(200).json({ posts, totalCount });
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
};

module.exports = { createTag, getAllTags, getCurrentTagPosts };
