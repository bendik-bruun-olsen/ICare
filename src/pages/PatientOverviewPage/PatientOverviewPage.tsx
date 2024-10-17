import styles from "./PatientOverviewPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { Paths } from "../../paths";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext, useEffect, useState } from "react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Button, Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { db } from "../../firebase/firebase";
import { getPatientPicture } from "../../firebase/patientImageServices/getPatientPicture";
import { se } from "date-fns/locale";
import { set } from "date-fns";
import Loading from "../../components/Loading/Loading";

export default function PatientOverview(): JSX.Element {
	const { addNotification } = useContext(NotificationContext);

	const [pictureUrl, setPictureUrl] = useState<{ [key: string]: string }>({});

	const [createdPatients, setCreatedPatients] = useState<DocumentData[]>([]);
	const [assignedPatients, setAssignedPatients] = useState<DocumentData[]>([]);
	const { currentUser, setCurrentPatientId } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchDefaultPictureUrl = async (): Promise<void> => {
			setIsLoading(true);
			const url = await getDefaultPictureUrl(addNotification);
			setIsLoading(false);
			if (!url) return;
			setPictureUrl({ default: url });
			setIsLoading(false);
		};
		fetchDefaultPictureUrl();
	}, []);

	const fetchProfilePictureForPatient = async (
		patientId: string
	): Promise<void> => {
		try {
			setIsLoading(true);
			const imageUrl = await getPatientPicture(patientId);
			setPictureUrl((prevImages) => ({
				...prevImages,
				[patientId]: imageUrl || prevImages[patientId],
			}));
			setIsLoading(false);
			if (!imageUrl) {
				const defaultPictureUrl = await getDefaultPictureUrl(addNotification);
				if (!defaultPictureUrl) return;
				setPictureUrl((prevImages) => ({
					...prevImages,
					[patientId]: defaultPictureUrl,
				}));
				setIsLoading(false);
			}
		} catch (error) {
			const imageUrl = await getPatientPicture(patientId);
			console.error("Error fetching profile picture:", error);
			setPictureUrl((prevImages) => ({
				...prevImages,
				[patientId]: imageUrl || prevImages[patientId],
			}));
		}
	};

	useEffect(() => {
		const fetchAllPatients = async (): Promise<void> => {
			setIsLoading(true);
			await fetchPatients();
		};
		fetchAllPatients();
	}, [currentUser?.email]);

	const fetchPatients = async (): Promise<void> => {
		if (!currentUser || !currentUser.email) return;
		setIsLoading(true);
		const userRef = doc(db, "users", currentUser.email);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			const userData = userDoc.data();

			const createdPatientList = userData.administeredPatients || [];
			const assignedPatientList = userData.assignedPatients || [];

			createdPatientList.forEach((patient: DocumentData) => {
				fetchProfilePictureForPatient(patient.patientId);
			});

			assignedPatientList.forEach((patient: DocumentData) => {
				fetchProfilePictureForPatient(patient.patientId);
			});

			setCreatedPatients(userData.administeredPatients || []);
			setAssignedPatients(userData.assignedPatients || []);
			setIsLoading(false);
		}
		setIsLoading(false);
	};

	const handlePatientClick = (patientId: string): void => {
		setCurrentPatientId(patientId);
		navigate(Paths.HOME);
	};

	if (isLoading)
		return (
			<>
				<Navbar centerContent="Patient Overview" />
				<Loading />
			</>
		);

	return (
		<div className={styles.pageWrapper}>
			<Navbar centerContent="Patient Overview" />
			<div className={styles.patientList}>
				<div className={styles.administeredPatientInfoSection}>
					<h2 className={styles.headlineText}>My Administered Patients</h2>
					<ul className={styles.administeredPatientList}>
						{createdPatients.length === 0 ? (
							<li>No administered patients found.</li>
						) : (
							createdPatients.map((patient) => (
								<li
									key={patient.patientId}
									className={styles.administeredPatientListItem}
									onClick={() => handlePatientClick(patient.patientId)}
								>
									<div className={styles.picNameAndEmail}>
										<img
											src={pictureUrl[patient.patientId] || pictureUrl}
											alt="Patient Profile"
										/>
										<div className={styles.nameAndEmail}>
											<h3>{patient.patientName}</h3>
										</div>
									</div>
								</li>
							))
						)}
					</ul>
				</div>
				<div className={styles.assignedPatientInfoSection}>
					<h2 className={styles.headlineText2}>My Assigned Patients</h2>
					<ul className={styles.assignedPatientList}>
						{assignedPatients.length === 0 ? (
							<li>No assigned patients found.</li>
						) : (
							assignedPatients.map((patient) => (
								<li
									className={styles.assignedPatientListItem}
									onClick={() => handlePatientClick(patient.patientId)}
								>
									<div className={styles.picNameAndEmail}>
										<img
											src={pictureUrl[patient.patientId] || pictureUrl}
											alt="Patient Profile"
										/>
										<div className={styles.nameAndEmail}>
											<h3>{patient.patientName}</h3>
										</div>
									</div>
								</li>
							))
						)}
					</ul>
				</div>
			</div>
			<Link to={Paths.CREATE_PATIENT}>
				<div className={styles.addIcon}>
					<Button variant="contained_icon">
						<Icon data={add} size={32} />
					</Button>
				</div>
			</Link>
		</div>
	);
}
