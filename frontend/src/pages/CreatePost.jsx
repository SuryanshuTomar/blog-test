import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContext, useState } from "react";
import { ImCross } from "react-icons/im";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Button from "../components/Button";

const CreatePost = () => {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);

	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [file, setFile] = useState(null);
	const [category, setCategory] = useState("");
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const deleteCategory = (i) => {
		let updatedCats = [...categories];
		updatedCats.splice(i);
		setCategories(updatedCats);
	};

	const addCategory = (event) => {
		event.preventDefault();
		let updatedCats = [...categories];
		updatedCats.push(category);
		setCategory("");
		setCategories(updatedCats);
	};

	const handleCreate = async (e) => {
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
				// Image upload
				const { data: imageData } = await axios.post(
					URL + "/api/upload",
					data
				);
				post.photo = imageData.imageUrl;

				// Post update
				const { data: postData } = await axios.post(
					URL + "/api/posts/create",
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

	return (
		<div>
			<Navbar />
			<div className="px-6 md:px-[200px] mt-8">
				<h1 className="text-xl font-bold md:text-2xl ">Create a post</h1>
				<form className="flex flex-col w-full mt-4 space-y-4 md:space-y-8">
					<input
						onChange={(e) => setTitle(e.target.value)}
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
									<p>{category}</p>
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
						rows={15}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter post description"
					/>
					{isLoading ? (
						<Loader />
					) : (
						<Button
							onClick={handleCreate}
							className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
						>
							Create
						</Button>
					)}
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default CreatePost;
