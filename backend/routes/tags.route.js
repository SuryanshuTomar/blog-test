const express = require("express");
const {
	getAllTags,
	createTag,
	getCurrentTagPosts,
} = require("../controllers/tags.controller");

// Get router instance
const router = express.Router();

// Create A NEW TAG
router.post("/", createTag);

// GET POSTS WITH TAGS
router.get("/:tagId", getCurrentTagPosts);

// GET ALL Tags
router.get("/", getAllTags);

module.exports = router;
