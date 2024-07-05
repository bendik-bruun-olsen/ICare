import { Icon } from "@equinor/eds-core-react";
import { arrow_back } from "@equinor/eds-icons";
import { useNavigate } from "react-router-dom";
import { Paths } from "../paths";

export default function BackHomeButton() {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate(Paths.HOME);
	};

	return (
		<Icon
			data={arrow_back}
			size={40}
			onClick={handleClick}
			style={{ cursor: "pointer", color: "var(--white)" }}
		/>
	);
}
