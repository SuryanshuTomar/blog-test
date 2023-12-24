const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/User.model");

const registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hashSync(password, salt);
		const newUser = new User({ username, email, password: hashedPassword });
		const savedUser = await newUser.save();
		res.status(200).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
};

const loginUser = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json("User not found!");
		}
		const match = await bcrypt.compare(req.body.password, user.password);

		if (!match) {
			return res.status(401).json("Wrong credentials!");
		}
		console.log({
			_id: user._id,
			username: user.username,
			email: user.email,
		});

		console.log("Check1", process.env.SECRET);
		const token = await jwt.sign(
			{ _id: user._id, username: user.username, email: user.email },
			process.env.SECRET,
			{
				httpOnly: true,
				secure: true, // Set to true in a live environment with HTTPS
				expiresIn: "3d",
			}
		);
		console.log("Check2");
		console.log("Login token ", token);
		const { password, ...info } = user._doc;
		res.cookie("token", token).status(200).json(info);
	} catch (err) {
		res.status(500).json(err);
	}
};

const logoutUser = async (req, res) => {
	try {
		res.clearCookie("token")
			.status(200)
			.send("User logged out successfully!");
	} catch (err) {
		res.status(500).json(err);
	}
};

const refreshUserToken = (req, res) => {
	const token = req.cookies.token;
	console.log("Refreshing token ", token);

	jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
		if (err) {
			return res.status(404).json(err);
		}
		res.status(200).json(data);
	});
};

module.exports = { registerUser, loginUser, logoutUser, refreshUserToken };
