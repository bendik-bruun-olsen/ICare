import React from "react";
import { Button } from "@equinor/eds-core-react";
import styled from "styled-components";

const StyledButton = styled.div`
	width: 150px;
`;

interface AddButtonProps {
	label: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => {
	return (
		<StyledButton>
			<Button as="button" type="submit" onClick={onClick}>
				{label}
			</Button>
		</StyledButton>
	);
};

export default AddButton;
