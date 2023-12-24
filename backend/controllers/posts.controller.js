const { findOrCreateTag } = require("../lib/utils");

// Models
const Post = require("../models/Post.model");
const Visit = require("../models/Visit.model");
const Comment = require("../models/Comment.model");

const createPost = async (req, res) => {
	try {
		const { title, desc, username, userId, categories, photo } = req.body;

		// Check if tags exist, create them if not
		const tags = await Promise.all(
			categories.map((tagName) => findOrCreateTag(tagName))
		);

		// Create a new post
		const newPost = new Post({
			title,
			desc,
			username,
			userId,
			categories: tags,
			photo,
		});
		const savedPost = await newPost.save();

		// Create a visit record for the new post
		const newVisit = new Visit({
			post: savedPost._id,
			count: 0, // Initialize the count to 0
		});
		await newVisit.save();

		res.status(200).json(savedPost);
	} catch (err) {
		res.status(500).json(err);
	}
};

const updatePost = async (req, res) => {
	try {
		const updatedPost = await Post.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		res.status(200).json(updatedPost);
	} catch (err) {
		res.status(500).json(err);
	}
};

const deletePost = async (req, res) => {
	try {
		await Post.findByIdAndDelete(req.params.id);
		await Comment.deleteMany({ postId: req.params.id });
		res.status(200).json("Post has been deleted!");
	} catch (err) {
		res.status(500).json(err);
	}
};

const getMostVisitedPosts = async (req, res) => {
	try {
		const mostVisitedPosts = await Post.aggregate([
			{
				$lookup: {
					from: "visits", // Assuming your visits collection is named 'visits'
					localField: "_id",
					foreignField: "post",
					as: "visitData",
				},
			},
			{
				$unwind: {
					path: "$visitData",
					preserveNullAndEmptyArrays: true, // Preserve posts without visits
				},
			},
			{
				$group: {
					_id: "$_id",
					title: { $first: "$title" },
					username: { $first: "$username" },
					updatedAt: { $first: "$updatedAt" },
					visitCount: { $sum: { $ifNull: ["$visitData.count", 0] } },
				},
			},
			{
				$sort: { visitCount: -1 },
			},
			{
				$limit: 3, // Adjust the number of posts as needed
			},
		]).exec();

		res.status(200).json(mostVisitedPosts);
	} catch (error) {
		console.error("Error fetching most visited posts:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

const getSinglePost = async (req, res) => {
	try {
		// Find the post by ID
		const post = await Post.findById(req.params.id);

		// Increment the visit count for the post
		const visit = await Visit.findOne({ post: post._id });

		if (visit) {
			visit.count += 1;
			await visit.save();
		} else {
			// If there is no existing visit record, create a new one
			const newVisit = new Visit({
				post: post._id,
				count: 1, // Initialize the count to 1
			});
			await newVisit.save();
		}

		// Send the post details in the response
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getCurrentUserPosts = async (req, res) => {
	try {
		const posts = await Post.find({ userId: req.params.userId });
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json(err);
	}
};

const getAllPosts = async (req, res) => {
	const query = req.query;
	try {
		let { page = 1, limit = 10, sortBy, sortOrder, search } = req.query;
		limit = parseInt(limit);
		const skip = (page - 1) * limit;

		let sort = {};
		if (sortBy && sortOrder) {
			sort[sortBy] = sortOrder === "desc" ? -1 : 1;
		}

		const filter = search
			? {
					$or: [
						{ title: { $regex: search, $options: "i" } },
						{ desc: { $regex: search, $options: "i" } },
					],
			  }
			: {};

		const posts = await Post.find(filter)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.exec();

		const totalCount = await Post.countDocuments(filter);
		res.status(200).json({ posts, totalCount });
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = {
	createPost,
	updatePost,
	deletePost,
	getSinglePost,
	getAllPosts,
	getMostVisitedPosts,
	getCurrentUserPosts,
};
