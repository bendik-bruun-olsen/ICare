import styles from "./PatientDetails.module.css";
interface PatientDetailsProps {
	patientName: string;
	age: string;
	signedInAs: string;
}

export default function PatientDetails({
	patientName,
	age,
	signedInAs,
}: PatientDetailsProps) {
	return (
		<>
			<div className={styles.patientDetailsWrapper}>
				<div className={styles.patientInfoBlock}>
					<img src="https://placehold.co/85x85" alt="Profile picture" />
					<div className={styles.PatientInfo}>
						<h1>{patientName}</h1>
						<p>{age}</p>
					</div>
				</div>
				<div className={styles.signedInAs}>
					<p>Signed in as: {signedInAs}</p>
				</div>
			</div>
		</>
	);
}
