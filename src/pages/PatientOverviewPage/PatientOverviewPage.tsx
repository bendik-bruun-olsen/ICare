import styles from "./PatientOverviewPage.module.css";
import Navbar from "../../components/Navbar/Navbar";

import { Paths } from "../../paths";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext, useEffect, useState } from "react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button, Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";

import { NotificationType } from "../../types";

import { useAuth } from "../../hooks/useAuth/useAuth";
import { db } from "../../firebase/firebase";

export default function PatientOverview(): JSX.Element {
  const { addNotification } = useContext(NotificationContext);

  const [pictureUrl, setPictureUrl] = useState("");
  const [createdPatients, setCreatedPatients] = useState<DocumentData[]>([]);
  const [assignedPatients, setAssignedPatients] = useState<DocumentData[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDefaultPictureUrl = async (): Promise<void> => {
      const url = await getDefaultPictureUrl(addNotification);
      if (!url) return;
      setPictureUrl(url);
    };
    fetchDefaultPictureUrl();
  }, [addNotification]);

  useEffect(() => {
    const fetchAllPatients = async (): Promise<void> => {
      await fetchPatients();
    };
    fetchAllPatients();
  }, [currentUser?.email, addNotification]);

  const fetchPatients = async (): Promise<void> => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Fetched user data:", userData);

      setCreatedPatients(userData.administeredPatients || []);
      setAssignedPatients(userData.assignedPatients || []);
    }
  };
  return (
    <div className={styles.pageWrapper}>
      <Navbar centerContent="Patient Overview" />
      <div className={styles.patientList}>
        <div className={`${styles.administeredPatientInfoSection} dropShadow`}>
          <h2 className={styles.headlineText}>My Administered Patients</h2>
          <ul className={styles.administeredPatientList}>
            {createdPatients.length === 0 ? (
              <li>No administered patients found.</li>
            ) : (
              createdPatients.map((patient) => (
                <li
                  key={patient.patientId}
                  className={styles.administeredPatientListItem}
                >
                  <div className={styles.picNameAndEmail}>
                    <img src={pictureUrl} alt="Default profile picture" />
                    <div className={styles.nameAndEmail}>
                      <h3>{patient.patientName}</h3>

                      <span>{patient.email}</span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className={`${styles.assignedPatientInfoSection} dropShadow`}>
          <h2 className={styles.headlineText}>My Assigned Patients</h2>
          <ul className={styles.assignedPatientList}>
            {assignedPatients.length === 0 ? (
              <li>No assigned patients found.</li>
            ) : (
              assignedPatients.map((patient) => (
                <li
                  key={patient.patientId}
                  className={styles.assignedPatientListItem}
                >
                  <div className={styles.picNameAndEmail}>
                    <img src={pictureUrl} alt="Default profile picture" />
                    <div className={styles.nameAndEmail}>
                      <h3>{patient.patientName}</h3>
                      <span>{patient.email}</span>
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
