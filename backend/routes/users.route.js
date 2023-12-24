const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
	updateUser,
	deleteUser,
	getCurrentUser,
} = require("../controllers/users.controller");

// Get router instance
const router = express.Router();

// UPDATE USER
router.put("/:id", verifyToken, updateUser);

// DELETE USER
router.delete("/:id", verifyToken, deleteUser);

// GET USER
router.get("/:id", getCurrentUser);

module.exports = router;
