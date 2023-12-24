/* eslint-disable react/prop-types */
const Button = ({ children, className, ...rest }) => {
	const ButtonClasses = `m-2 px-4 py-2 rounded-lg text-white bg-gray-900 ${className}`;

	return (
		<button className={ButtonClasses} {...rest}>
			{children}
		</button>
	);
};
export default Button;
