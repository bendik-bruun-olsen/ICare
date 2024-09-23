import { Link } from "react-router-dom";
import styles from "./PatientDetails.module.css";
import { Paths } from "../../paths";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { getPatientPicture } from "../../firebase/patientImageServices/getPatientPicture";
import { useEffect, useState } from "react";
import PatientProfilePicture from "../PatientProfilePicture/PatientProfilePicture";

interface PatientDetailsProps {
	patientName: string;
	age: string;
}

export default function PatientDetails({
	patientName,
	age,
}: PatientDetailsProps): JSX.Element {
	const { currentUser, currentPatientId: patientId } = useAuth();
	const [pictureUrl, setPictureUrl] = useState<string>("");
	const currentPatientId = useAuth().currentPatientId;
	useEffect(() => {
		const fetchProfilePicture = async (): Promise<void> => {
			if (currentUser?.email && currentPatientId) {
				const url = await getPatientPicture(
					currentUser.email,
					currentPatientId
				);
				if (url) {
					setPictureUrl(url);
				}
			}
		};

		fetchProfilePicture();
	}, [currentUser, currentPatientId]);

	if (!patientId) return <></>;
	return (
		<>
			<div className={styles.patientDetailsWrapper}>
				<div className={styles.patientInfoBlock}>
					<PatientProfilePicture
						setProfileImage={pictureUrl || null}
						patientId={currentPatientId || ""}
						showIcon={false}
						showMaxFileSize={false}
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
