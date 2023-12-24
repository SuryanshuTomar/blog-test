import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { URL } from "../url";
import { IoEyeSharp } from "react-icons/io5";

const Trending = () => {
	const { user } = useContext(UserContext);

	const [mostVisitedPosts, setMostVisitedPosts] = useState([]);

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const url = URL + "/api/posts/trending";
				const { data } = await axios.get(url);
				setMostVisitedPosts(data);
			} catch (error) {
				console.error("Error fetching most visited posts:", error);
			}
		};
		fetchTags();
	}, []); // Empty dependency array ensures that the effect runs only once


	return (
		<div>
			<ul>
				{mostVisitedPosts.map((post) => (
					<div key={post._id}>
						<Link to={user ? `/posts/post/${post._id}` : "/login"}>
							<div className="flex w-full mt-4 space-x-4">
								{/* right */}
								<div className="flex flex-col w-full p-2 border-2 rounded">
									<h1 className="mb-1 font-medium">{post.title}</h1>
									<div className="flex items-center justify-between text-sm font-semibold text-gray-500">
										<p>@{post.username}</p>
										<div className="flex items-center text-sm space-between">
											<IoEyeSharp /> &nbsp; <p>{post.visitCount}</p>
										</div>
									</div>
								</div>
							</div>
						</Link>
					</div>
				))}
			</ul>
		</div>
	);
};

export default Trending;
