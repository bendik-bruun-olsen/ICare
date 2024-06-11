import styles from "./PatientDetails.module.css";

export default function PatientDetails() {
	return (
		<>
			<div className={styles.patientDetailsWrapper}>
				<div className={styles.patientInfoBlock}>
					<img src="https://placehold.co/85x85" alt="Profile picture" />
					<div className={styles.PatientInfo}>
						<h1>Patient Name</h1>
						<p>Age</p>
					</div>
				</div>
				<div className={styles.signedInAs}>
					<p>Signed in as: First name</p>
				</div>
			</div>
		</>
	);
}
