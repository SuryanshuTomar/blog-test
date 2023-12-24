import axios from "axios";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import SingleCategory from "../components/SingleCategory";

import { URL } from "../url";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { UserContext } from "../context/UserContext";
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
	const navigate = useNavigate();
	const { id: postId } = useParams();
	const { user } = useContext(UserContext);

	const [post, setPost] = useState({});
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	const [loader, setLoader] = useState(false);

	const postComment = async (e) => {
		e.preventDefault();
		try {
			const commentdata = {
				comment: comment,
				author: user.username,
				postId: postId,
				userId: user._id,
			};
			await axios.post(URL + "/api/comments/create", commentdata, {
				withCredentials: true,
			});

			const updatedComments = [...comments, commentdata];
			setComment("");
			setComments(updatedComments);
		} catch (err) {
			console.log(err);
		}
	};

	const deleteComment = async (id) => {
		try {
			await axios.delete(URL + "/api/comments/" + id, {
				withCredentials: true,
			});

			const updatedComments = comments.filter(
				(comment) => comment._id !== id
			);
			setComments(updatedComments);
		} catch (err) {
			console.log(err);
		}
	};

	const handleDeletePost = async () => {
		try {
			await axios.delete(URL + "/api/posts/" + postId, {
				withCredentials: true,
			});
			navigate("/");
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const { data } = await axios.get(URL + "/api/posts/" + postId);
				setPost(data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchPost();
	}, [postId]);

	useEffect(() => {
		const fetchPostComments = async () => {
			setLoader(true);
			try {
				const { data } = await axios.get(
					URL + "/api/comments/post/" + postId
				);
				setComments(data);
				setLoader(false);
			} catch (err) {
				setLoader(true);
				console.log(err);
			}
		};

		fetchPostComments();
	}, [postId]);

	const commentsContent = comments?.map((comment, index) => (
		<Fragment key={comment._id ?? index}>
			<Comment comment={comment} deleteComment={deleteComment} />
		</Fragment>
	));

	return (
		<div>
			<Navbar />
			{loader ? (
				<div className="h-[80vh] flex justify-center items-center w-full">
					<Loader />
				</div>
			) : (
				<div className="px-8 md:px-[200px] mt-8">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-black md:text-3xl">
							{post.title}
						</h1>
						{user?._id === post?.userId && (
							<div className="flex items-center justify-center space-x-2">
								<p
									className="cursor-pointer"
									onClick={() => navigate("/edit/" + postId)}
								>
									<BiEdit />
								</p>
								<p
									className="cursor-pointer"
									onClick={handleDeletePost}
								>
									<MdDelete />
								</p>
							</div>
						)}
					</div>
					<div className="flex items-center justify-between mt-2 md:mt-4">
						<p>@{post.username}</p>
						<div className="flex space-x-2">
							<p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
							<p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
						</div>
					</div>
					{post?.photo && (
						<img
							src={post.photo}
							className="w-full mx-auto mt-8"
							alt=""
						/>
					)}
					<p className="mx-auto mt-8">{post.desc}</p>
					<div className="flex items-center mt-8 space-x-4 font-semibold">
						<p>Categories:</p>
						<div className="flex items-center justify-center space-x-2">
							{post.categories?.map((cat) => (
								<div key={cat._id}>
									<SingleCategory>{cat.tagName}</SingleCategory>
								</div>
							))}
						</div>
					</div>
					<div className="flex flex-col mt-4">
						<h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
						{commentsContent}
					</div>
					{/* write a comment */}
					<div className="flex flex-col w-full mt-4 md:flex-row">
						<input
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							type="text"
							placeholder="Write a comment"
							className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0"
						/>
						<button
							onClick={postComment}
							className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0"
						>
							Add Comment
						</button>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default PostDetails;
