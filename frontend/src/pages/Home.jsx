import axios from "axios";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import { URL } from "../url";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";
import TagList from "../components/Categories";
import Trending from "../components/Trending";
import Button from "../components/Button";
import { FaSort } from "react-icons/fa";

const Home = () => {
	const { search } = useLocation();
	const { user } = useContext(UserContext);

	const [posts, setPosts] = useState([]);
	const [noResults, setNoResults] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalDocs, setTotalDocs] = useState(0);
	const [totalPostPerPage] = useState(3);
	const [loader, setLoader] = useState(false);
	const [isSortedInAsc, setIsSortedInAsc] = useState(true);

	const fetchPosts = useCallback(async () => {
		setLoader(true);
		try {
			const isSearchPresent = search === "";
			const updatedSearch = isSearchPresent ? "?" : search + "&";
			const url = `${URL}/api/posts/${updatedSearch}page=${currentPage}&limit=${totalPostPerPage}&sortBy=title&sortOrder=${
				isSortedInAsc ? "asc" : "desc"
			}`;
			const { data } = await axios.get(url);
			setPosts(data.posts);
			setTotalDocs(data.totalCount);

			const calculatedtotalPages = data.totalCount / totalPostPerPage;
			const parsedIntTotalPages = Number.parseInt(calculatedtotalPages, 10);
			const updatedTotalPages =
				calculatedtotalPages === parsedIntTotalPages
					? calculatedtotalPages
					: parsedIntTotalPages + 1;

			setTotalPages(updatedTotalPages);
			if (data.posts.length === 0) {
				setNoResults(true);
			} else {
				setNoResults(false);
			}
		} catch (err) {
			setNoResults(true);
			console.log(err);
		} finally {
			setLoader(false);
		}
	}, [search, currentPage, totalPostPerPage, isSortedInAsc]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (
		<>
			<Navbar fetchPosts={fetchPosts} />
			<div className="px-8 min-h-[80vh]">
				{loader ? (
					<div className="h-[40vh] flex justify-center items-center">
						<Loader />
					</div>
				) : !noResults ? (
					<div className="flex flex-col-reverse justify-between mt-4 md:flex-row items-top">
						<div className="w-full md:w-[70%] flex flex-col items-start justify-between">
							<div className="flex items-center justify-between w-full mt-4 border-t-4">
								<span className="mt-4 text-2xl font-medium">
									{search.length === 0
										? "Today"
										: "Result: " + totalDocs}
								</span>

								<span
									className="flex items-center font-bold cursor-pointer"
									onClick={() =>
										setIsSortedInAsc((prevValue) => !prevValue)
									}
								>
									Sort &nbsp;
									<FaSort />
								</span>
							</div>
							{posts.map((post) => (
								<div key={post._id}>
									<Link
										to={user ? `/posts/post/${post._id}` : "/login"}
									>
										<HomePosts key={post._id} post={post} />
									</Link>
								</div>
							))}
							<div className="flex items-center justify-center w-full mt-2">
								<Button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage <= 1}
								>
									Previous Page
								</Button>
								<h3 className="m-2 text-lg font-medium">
									Page {currentPage} of {totalPages}
								</h3>
								<Button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage >= totalPages}
								>
									Next Page
								</Button>
							</div>
						</div>
						<div className="md:w-[25%] flex flex-col">
							<TagList
								totalPostPerPage={totalPostPerPage}
								setPosts={setPosts}
								setTotalDocs={setTotalDocs}
								setTotalPages={setTotalPages}
							/>
							<div className="mt-8">
								<h1 className="text-2xl font-medium text-center">
									Trending
								</h1>
								<Trending />
							</div>
						</div>
					</div>
				) : (
					<h3 className="mt-16 font-bold text-center">
						No posts available
					</h3>
				)}
			</div>
			<Footer />
		</>
	);
};

export default Home;
