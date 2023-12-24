const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const path = require("path");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/users.route");
const postRoute = require("./routes/posts.route");
const commentRoute = require("./routes/comments.route");
const tagsRoute = require("./routes/tags.route");

// Get App Instance
const app = express();

// Config Env
dotenv.config();

// Database Connection
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("database is connected successfully!");
	} catch (err) {
		console.log(err);
	}
};

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_KEY_SECRET,
});

// Middlewares
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => res.json("Hello World!"));

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(
	cors({
		origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
		credentials: true,
	})
);
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/tags", tagsRoute);

// Upload the image to Cloudinary
app.post("/api/upload", upload.single("file"), (req, res) => {
	cloudinary.uploader
		.upload_stream({ resource_type: "image" }, (error, result) => {
			if (error) {
				return res.status(500).json({ error: "Image upload failed" });
			}

			const imageUrl = result.secure_url;
			res.json({ imageUrl });
		})
		.end(req.file.buffer);
});

app.listen(process.env.PORT, () => {
	connectDB();
	console.log("app is running on port " + process.env.PORT);
});
