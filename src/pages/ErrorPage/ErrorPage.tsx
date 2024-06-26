import styles from "./ErrorPage.module.css";
import { Button } from "@equinor/eds-core-react";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";

const ErrorPage = () => {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate(Paths.HOME);
	};

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>An unexpected error occurred.</h1>
			<p className={styles.subtitle}>
				Please contact an administrator if the problem persists.
			</p>
			<div className={styles.buttonContainer}>
				<Button id={styles.returnButton} onClick={handleClick}>
					Return Home
				</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
