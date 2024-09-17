import { Link } from "react-router-dom";
import styles from "./PatientDetails.module.css";
import { Paths } from "../../paths";
import { useAuth } from "../../hooks/useAuth/useAuth";

interface PatientDetailsProps {
	patientName: string;
	age: string;
}

export default function PatientDetails({
	patientName,
	age,
}: PatientDetailsProps): JSX.Element {
	const { currentPatientId: patientId } = useAuth();
	if (!patientId) return <></>;
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
					<Link to={Paths.PATIENT_DETAILS}>Patient details</Link>
				</div>
			</div>
		</>
	);
}
