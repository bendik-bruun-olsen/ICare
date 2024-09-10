import React from "react";
import { Button } from "@equinor/eds-core-react";
import styles from "./AddButton.module.css";

interface AddButtonProps {
	label: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export default function AddButton({
	label,
	onClick,
}: AddButtonProps): React.ReactElement {
	return (
		<div className={styles.button}>
			<Button as="button" type="submit" onClick={onClick}>
				{label}
			</Button>
		</div>
	);
}
