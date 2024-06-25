import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import { Button } from "@equinor/eds-core-react";

const ErrorPage = () => {
	const location = useLocation();
	const error = location.state?.error;

	useEffect(() => {
		console.log("error page: ", error);
	}, [error]);

	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>An unexpected error occurred.</h1>
			<p className={styles.subtitle}>
				Please contact an administrator if the problem persists.
			</p>
			{error.message && (
				<p className={styles.subtitle}>{error.message}</p>
			)}
			<div className={styles.buttonContainer}>
				<Button id={styles.returnButton}>Return Home</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
