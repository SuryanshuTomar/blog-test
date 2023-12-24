import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import Button from "../components/Button";

const EditPost = () => {
	const navigate = useNavigate();
	const { id: postId } = useParams();
	const { user } = useContext(UserContext);

	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [file, setFile] = useState(null);
	const [category, setCategory] = useState("");
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdate = async (e) => {
		e.preventDefault();
		const post = {
			title,
			desc,
			username: user.username,
			userId: user._id,
			categories,
		};

		if (file) {
			const data = new FormData();
			const filename = Date.now() + file.name;
			data.append("img", filename);
			data.append("file", file);

			try {
				setIsLoading(true);
				// Upload the new image
				const { data: imageData } = await axios.post(
					URL + "/api/upload",
					data
				);
				post.photo = imageData.imageUrl;

				// Post Update
				const { data: postData } = await axios.put(
					URL + "/api/posts/" + postId,
					post,
					{
						withCredentials: true,
					}
				);
				navigate("/posts/post/" + postData._id);
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const { data } = await axios.get(URL + "/api/posts/" + postId);
				console.log("Response: ", data);
				setTitle(data.title);
				setDesc(data.desc);
				setFile(data.photo);
				setCategories(data.categories);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPost();
	}, [postId]);

	const deleteCategory = (i) => {
		let updatedCats = [...categories];
		updatedCats.splice(i);
		setCategories(updatedCats);
	};

	const addCategory = async (event) => {
		event.preventDefault();
		try {
			// Check if the category already exists
			const { data: tagsData } = await axios.get(URL + "/api/tags");
			const isAlreadyPresent = tagsData.find(
				(tag) => tag.name.toLowerCase() === category.toLowerCase()
			);

			let updatedCats = [];

			// Category already exists, handle accordingly (show a message, etc.)
			if (isAlreadyPresent) {
				updatedCats = [
					...categories,
					{
						...isAlreadyPresent,
						tagName: isAlreadyPresent.name,
						tagId: isAlreadyPresent._id,
					},
				];
			} else {
				const response = await axios.post(URL + "/api/tags", {
					tagName: category,
				});
				const newCategory = response.data;
				updatedCats = [
					...categories,
					{
						...newCategory,
						tagName: newCategory.name,
						tagId: newCategory._id,
					},
				];
			}

			// Update state with the new category
			setCategories(updatedCats);
			setCategory("");
		} catch (error) {
			console.error("Error adding category:", error);
		}
	};

	return (
		<div>
			<Navbar />
			<div className="px-6 md:px-[200px] mt-8">
				<h1 className="text-xl font-bold md:text-2xl ">Update a post</h1>
				<form className="flex flex-col w-full mt-4 space-y-4 md:space-y-8">
					<input
						onChange={(e) => setTitle(e.target.value)}
						value={title}
						type="text"
						placeholder="Enter post title"
						className="px-4 py-2 outline-none"
					/>
					<input
						onChange={(e) => setFile(e.target.files[0])}
						type="file"
						className="px-4"
					/>
					<div className="flex flex-col">
						<div className="flex items-center space-x-4 md:space-x-8">
							<input
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="px-4 py-2 outline-none"
								placeholder="Enter post category"
								type="text"
							/>
							<Button
								onClick={addCategory}
								className="px-4 py-2 font-semibold text-white bg-black cursor-pointer"
							>
								Add
							</Button>
						</div>

						{/* categories */}
						<div className="flex px-4 mt-3">
							{categories?.map((category, i) => (
								<div
									key={category._id}
									className="flex items-center justify-center px-2 py-1 mr-4 space-x-2 bg-gray-200 rounded-md"
								>
									<p>{category.tagName}</p>
									<p
										onClick={() => deleteCategory(i)}
										className="p-1 text-sm text-white bg-black rounded-full cursor-pointer"
									>
										<ImCross />
									</p>
								</div>
							))}
						</div>
					</div>
					<textarea
						onChange={(e) => setDesc(e.target.value)}
						value={desc}
						rows={15}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter post description"
					/>
					{isLoading ? (
						<Loader />
					) : (
						<Button
							onClick={handleUpdate}
							className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
						>
							Update
						</Button>
					)}
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default EditPost;
