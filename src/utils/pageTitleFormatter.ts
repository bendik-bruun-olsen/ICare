export const pageTitleFormatter = (input: string): string => {
	if (input === "/") {
		return "Home";
	}

	const lowercase = input.toLowerCase();

	const spaced = lowercase.replace(/-/g, " ").replace(/\//g, "");
	let capitalized = spaced.replace(/\b\w/g, (char) => char.toUpperCase());
	capitalized = capitalized.replace(/\bTodo\b/gi, "ToDo");

	return capitalized;
};
