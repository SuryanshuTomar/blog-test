/* eslint-disable react/prop-types */
import { MdDelete } from "react-icons/md";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Comment = ({ comment, deleteComment }) => {
	const { user } = useContext(UserContext);

	return (
		<div className="px-2 py-2 my-2 bg-gray-200 rounded-lg">
			<div className="flex items-center justify-between">
				<h3 className="font-bold text-gray-600">@{comment?.author}</h3>
				<div className="flex items-center justify-center space-x-4">
					<p>
						{new Date(comment?.updatedAt ?? Date.now())
							.toString()
							.slice(0, 15)}
					</p>
					<p>
						{new Date(comment?.updatedAt ?? Date.now())
							.toString()
							.slice(16, 24)}
					</p>
					{user?._id === comment?.userId && comment._id ? (
						<div className="flex items-center justify-center space-x-2">
							<p
								className="cursor-pointer"
								onClick={() => deleteComment(comment._id)}
							>
								<MdDelete />
							</p>
						</div>
					) : (
						""
					)}
				</div>
			</div>
			<p className="px-4 mt-2">{comment?.comment}</p>
		</div>
	);
};

export default Comment;
