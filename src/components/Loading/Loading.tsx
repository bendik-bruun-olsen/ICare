import { CircularProgress } from "@equinor/eds-core-react";
import styles from "./Loading.module.css";

export default function Loading(): JSX.Element {
	return (
		<div className={styles.loadingWrapper}>
			<CircularProgress size={48} />
		</div>
	);
}
