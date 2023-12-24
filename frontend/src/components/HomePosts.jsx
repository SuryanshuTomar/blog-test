/* eslint-disable react/prop-types */

const HomePosts = ({ post }) => {
	return (
		<div className="flex items-center justify-center w-full p-2 mt-8 space-x-4 border-4 rounded-lg">
			{/* left */}
			<div className="hidden md:flex md:w-[35%] md:h-[200px] justify-center items-center">
				{post?.photo && (
					<img
						src={post.photo}
						alt=""
						className="object-cover w-full h-full rounded"
					/>
				)}
			</div>
			{/* right */}
			<div className="flex flex-col w-full md:w-[65%]">
				<h1 className="mb-1 text-xl font-bold md:mb-2 md:text-2xl">
					{post.title}
				</h1>
				<div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-500 md:mb-4">
					<p>@{post.username}</p>
					<div className="flex space-x-2 text-sm">
						<p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
						<p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
					</div>
				</div>
				<p className="text-sm md:text-lg">
					{post.desc.slice(0, 200) + " ...Read more"}
				</p>
			</div>
		</div>
	);
};

export default HomePosts;
