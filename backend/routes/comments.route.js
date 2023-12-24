const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
	createComment,
	updateComment,
	deleteComment,
	getAllPostComments,
} = require("../controllers/comments.controller");

// Get router instance
const router = express.Router();

// CREATE A COMMENT
router.post("/create", verifyToken, createComment);

// UPDATE A COMMENT
router.put("/:id", verifyToken, updateComment);

// DELETE A COMMENT
router.delete("/:id", verifyToken, deleteComment);

// GET ALL COMMENTS ON A POST
router.get("/post/:postId", getAllPostComments);

module.exports = router;
