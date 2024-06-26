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
			<div className={styles.textContainer}>
				<h1 className={styles.title}>Oops!</h1>
				<h2 className={styles.subtitle}>Something Went Wrong.</h2>
				<p className={styles.paragraph}>
					We're experiencing an issue right now. Please try again
					later.
				</p>
			</div>
			<div className={styles.buttonContainer}>
				<Button id={styles.returnButton} onClick={handleClick}>
					Back To Home
				</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
