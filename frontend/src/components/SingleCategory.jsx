// eslint-disable-next-line react/prop-types
const SingleCategory = ({ children, key }) => {
	return (
		<div
			key={key}
			className="p-1 px-2 text-center text-white bg-gray-500 rounded min-w-20 max-w-content"
		>
			{children}
		</div>
	);
};
export default SingleCategory;
