import { useCallback, useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const navigate = useNavigate();
	const { user, setUser } = useContext(UserContext);

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [posts, setPosts] = useState([]);
	const [updated, setUpdated] = useState(false);

	const handleUserUpdate = async () => {
		setUpdated(false);
		try {
			await axios.put(
				URL + "/api/users/" + user?._id,
				{ username, email, password },
				{ withCredentials: true }
			);
			setUpdated(true);
		} catch (err) {
			console.log(err);
			setUpdated(false);
		}
	};

	const handleUserDelete = async () => {
		try {
			await axios.delete(URL + "/api/users/" + user?._id, {
				withCredentials: true,
			});
			localStorage.removeItem("user");
			setUser(null);
			navigate("/");
		} catch (err) {
			console.log(err);
		}
	};

	const fetchProfile = useCallback(
		() => async () => {
			try {
				const res = await axios.get(URL + "/api/users/" + user?._id);
				console.log("Profile: ", res.data);
				setUsername(res.data.username);
				setEmail(res.data.email);
				setPassword(res.data.password);
			} catch (err) {
				console.log(err);
			}
		},
		[user]
	);

	const fetchUserPosts = useCallback(async () => {
		try {
			const res = await axios.get(URL + "/api/posts/user/" + user?._id);
			console.log("Post Data: ", res.data);
			setPosts(res.data);
		} catch (err) {
			console.log(err);
		}
	}, [user]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	useEffect(() => {
		fetchUserPosts();
	}, [fetchUserPosts]);

	return (
		<div>
			<Navbar />
			<div className="min-h-[80vh] px-8 mt-8 flex md:flex-row flex-col-reverse md:items-start items-start justify-between">
				<div className="flex flex-col md:w-[70%] w-full mt-8 md:mt-0">
					<h1 className="mb-4 text-xl font-bold">Your posts:</h1>
					{posts?.map((post) => (
						<ProfilePosts key={post._id} post={post} />
					))}
				</div>
				<div className="md:sticky md:top-12  flex justify-start md:justify-end items-start md:w-[30%] w-full md:items-end ">
					<div className="flex flex-col items-center w-full space-y-4 ">
						<h1 className="mb-4 text-xl font-bold">Profile</h1>
						<input
							onChange={(e) => setUsername(e.target.value)}
							value={username}
							className="px-4 py-2 text-gray-500 outline-none"
							placeholder="Your username"
							type="text"
						/>
						<input
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							className="px-4 py-2 text-gray-500 outline-none"
							placeholder="Your email"
							type="email"
						/>
						{/* <input onChange={(e)=>setPassword(e.target.value)} value={password} className="px-4 py-2 text-gray-500 outline-none" placeholder="Your password" type="password"/> */}
						<div className="flex items-center mt-8 space-x-4">
							<button
								onClick={handleUserUpdate}
								className="px-4 py-2 font-semibold text-white bg-black hover:text-black hover:bg-gray-400"
							>
								Update
							</button>
							<button
								onClick={handleUserDelete}
								className="px-4 py-2 font-semibold text-white bg-black hover:text-black hover:bg-gray-400"
							>
								Delete
							</button>
						</div>
						{updated && (
							<h3 className="mt-4 text-sm text-center text-green-500">
								user updated successfully!
							</h3>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Profile;
