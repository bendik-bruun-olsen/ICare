import { Icon } from "@equinor/eds-core-react";
import { arrow_forward } from "@equinor/eds-icons";
import styles from "./PatientDetails.module.css";
interface PatientDetailsProps {
	patientName: string;
	age: string;
}

export default function PatientDetails({
	patientName,
	age,
}: PatientDetailsProps) {
	return (
		<>
			<div className={styles.patientDetailsWrapper}>
				<div className={styles.patientInfoBlock}>
					<img
						src="https://placehold.co/85x85/gray/white"
						alt="Profile picture"
					/>
					<div className={styles.PatientInfo}>
						<h2>{patientName}</h2>
						<p>Age: {age}</p>
					</div>
				</div>
				<div className={styles.morePatientDetails}>
					<p>Patient details </p>
					<Icon data={arrow_forward} size={18}></Icon>
				</div>
			</div>
		</>
	);
}
