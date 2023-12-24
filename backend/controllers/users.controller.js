const bcrypt = require("bcrypt");

// Models
const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

const updateUser = async (req, res) => {
	try {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hashSync(req.body.password, salt);
		}
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
};

const deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		await Post.deleteMany({ userId: req.params.id });
		await Comment.deleteMany({ userId: req.params.id });
		res.status(200).json("User has been deleted!");
	} catch (err) {
		res.status(500).json(err);
	}
};

const getCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...info } = user._doc;
		res.status(200).json(info);
	} catch (err) {
		res.status(500).json(err);
	}
};

module.exports = { updateUser, deleteUser, getCurrentUser };
