import styles from "./PatientOverviewPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Loading from "../../components/Loading/Loading";
import { Paths } from "../../paths";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";

export default function PatientOverviewPage(): JSX.Element {
  const { addNotification } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.pageWrapper}>
      <Navbar centerContent="Patient Overview" />
      {isLoading && <Loading />}
      <div className={styles.patientList}>
        <div className={`${styles.administeredPatientInfoSection} dropShadow`}>
          <h2 className={styles.headlineText}>My administered patient</h2>
          <ul className={styles.administeredPatientList}>
            {/* <li>
              <div className={styles.picNameAndEmail}>
                <img src={pictureUrl} alt="Default profile picture" />
                <div className={styles.nameAndEmail}>
                  <h3>{patient.name}</h3>
                  <span>{patient.email}</span>
                </div>
              </div>
              1
            </li> */}
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
        <div className={`${styles.assignedPatientInfoSection} dropShadow`}>
          <h2 className={styles.headlineText}>My assigned patient</h2>
          <ul className={styles.assignedPatientList}>
            <li>1</li>
            <li>2</li>
            <li>3</li>
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
