const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
	createPost,
	updatePost,
	deletePost,
	getMostVisitedPosts,
	getSinglePost,
	getCurrentUserPosts,
	getAllPosts,
} = require("../controllers/posts.controller");

// Get the router instance
const router = express.Router();

// CREATE A NEW POST
router.post("/create", verifyToken, createPost);

// UPDATE POST
router.put("/:id", verifyToken, updatePost);

// DELETE POST
router.delete("/:id", verifyToken, deletePost);

// GET MOST VISITED POSTS
router.get("/trending", getMostVisitedPosts);

// GET A SINGLE POST
router.get("/:id", getSinglePost);

// GET CURRENT USER POSTS
router.get("/user/:userId", getCurrentUserPosts);

// GET ALL POSTS
router.get("/", getAllPosts);

module.exports = router;
