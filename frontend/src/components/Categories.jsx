/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../url";

const TagList = ({
	totalPostPerPage,
	setPosts,
	setTotalDocs,
	setTotalPages,
}) => {
	const [tags, setTags] = useState([]);

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const { data } = await axios.get(URL + "/api/tags");
				setTags(data);
			} catch (error) {
				console.error("Error fetching tags:", error);
			}
		};
		fetchTags();
	}, []); // Empty dependency array ensures that the effect runs only once

	useEffect(() => {}, []);

	const fetchPostsByTag = async (tagId) => {
		try {
			const { data } = await axios.get(URL + `/api/tags/${tagId}`);
			setPosts(data.posts);
			setTotalDocs(data.totalCount);

			const calculatedtotalPages = data.totalCount / totalPostPerPage;
			const parsedIntTotalPages = Number.parseInt(calculatedtotalPages, 10);
			const updatedTotalPages =
				calculatedtotalPages === parsedIntTotalPages
					? calculatedtotalPages
					: parsedIntTotalPages + 1;

			setTotalPages(updatedTotalPages);
		} catch (error) {
			console.error(`Error fetching posts for tag ${tagId}:`, error);
		}
	};

	return (
		<div className="h-56 p-2 overflow-auto border-l-4">
			<h2 className="mb-4 text-xl font-medium text-center">Categories</h2>
			<ul>
				{tags.map((tag) => (
					<li
						key={tag._id}
						className="pb-1 text-center underline uppercase cursor-pointer"
						onClick={() => fetchPostsByTag(tag._id)}
					>
						{tag.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default TagList;
