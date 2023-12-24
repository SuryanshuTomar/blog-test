/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { useContext, useState } from "react";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";

const Navbar = ({ fetchPosts }) => {
	const [prompt, setPrompt] = useState("");
	const [menu, setMenu] = useState(false);
	const navigate = useNavigate();
	const path = useLocation().pathname;

	const showMenu = () => {
		setMenu(!menu);
	};

	const { user } = useContext(UserContext);

	return (
		<div className="flex flex-col sm:flex-row items-end justify-center sm:justify-between px-6 md:px-[200px] py-4">
			<h1
				className="text-lg font-extrabold md:text-xl"
				onClick={() => fetchPosts?.()}
			>
				<Link to="/">Blogster</Link>
			</h1>
			{path === "/" && (
				<div className="flex items-center justify-center w-10 m-2 space-x-0 sm:m-0">
					<p
						onClick={() => {
							setPrompt("");
							navigate(prompt ? "?search=" + prompt : navigate("/"));
						}}
						className="w-full cursor-pointer"
					>
						<BsSearch />
					</p>
					<input
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						className="px-3 outline-none "
						placeholder="Search a post"
						type="text"
					/>
				</div>
			)}
			<div className="flex items-center justify-center space-x-2 md:space-x-4">
				{user ? (
					<h3>
						<Link to="/write">Write</Link>
					</h3>
				) : (
					<h3>
						<Link to="/login">Login</Link>
					</h3>
				)}
				{user ? (
					<div onClick={showMenu}>
						<p className="relative cursor-pointer">
							<FaBars />
						</p>
						{menu && <Menu />}
					</div>
				) : (
					<h3>
						<Link to="/register">Register</Link>
					</h3>
				)}
			</div>
			{/* <div onClick={showMenu} className="text-lg md:hidden">
				<p className="relative cursor-pointer">
					<FaBars />
				</p>
				{menu && <Menu />}
			</div> */}
		</div>
	);
};

export default Navbar;
