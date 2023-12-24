
const express = require("express");

const {
	registerUser,
	loginUser,
	logoutUser,
	refreshUserToken,
} = require("../controllers/auth.controller");

// Get router instance
const router = express.Router();

// REGISTER A USER
router.post("/register", registerUser);

// LOGIN USER
router.post("/login", loginUser);

// LOGOUT CURENT USER
router.get("/logout", logoutUser);

// REFRESH USER TOKE
router.get("/refetch", refreshUserToken);

module.exports = router;
