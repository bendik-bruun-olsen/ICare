import styles from "./TaskContainer.module.css";

export default function TaskContainer() {
	return (
		<div>
			<div>
				<h1>08:00 - Morning Walk</h1>
			</div>
			<div>
				<p className={styles.DescriptionSection}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
					elementum tempor facilisis.
				</p>
			</div>
			<div>
				<p>Comment</p>
			</div>
		</div>
	);
}
