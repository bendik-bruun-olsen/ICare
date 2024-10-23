import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./CreatePatientPage.module.css";
import { InputWrapper, Input, Button, Icon } from "@equinor/eds-core-react";
import { add, remove_outlined } from "@equinor/eds-icons";
import Loading from "../../components/Loading/Loading";

import {
  Caretaker,
  FormFieldProps,
  NotificationType,
  NewPatient,
  personalInfoFields,
  healthInfoFields,
} from "../../types";
import { addPatient } from "../../firebase/patientServices/addPatient";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import { checkEmailExists } from "../../firebase/patientServices/checkEmail";
import { defaultPatientFormData } from "../../constants/defaultPatientFormData";
import PatientProfilePicture from "../../components/PatientProfilePicture/PatientProfilePicture";
import { uploadProfilePicture } from "../../firebase/patientImageServices/patientPictureService";
import getNameFromEmail from "../../firebase/userServices/getNameFromEmail";
import { NotificationContext } from "../../context/NotificationContext";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";

const FormField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  type,
}: FormFieldProps): JSX.Element => (
  <InputWrapper
    className={`${styles.inputWrapper} inputWrapper`}
    labelProps={{
      label: (
        <>
          {label}
          {required && <span className={styles.required}>*</span>}
        </>
      ),
      htmlFor: name,
    }}
  >
    <Input
      required={required}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      type={type}
    />
  </InputWrapper>
);

export default function CreatePatientPage(): JSX.Element {
  const { addNotification } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [caretakerEmail, setCaretakerEmail] = useState("");
  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [formData, setFormData] = useState<NewPatient>(defaultPatientFormData);
  const [pictureUrl, setPictureUrl] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { setCurrentPatientId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDefaultPictureUrl = async (): Promise<void> => {
      const url = await getDefaultPictureUrl(addNotification);
      if (!url) return;
      setPictureUrl(url);
    };
    fetchDefaultPictureUrl();
  }, []);

  const isFormDataValid = (formData: NewPatient): boolean => {
    const { age, phone } = formData;
    if (isNaN(Number(age))) return false;
    if (isNaN(Number(phone))) return false;
    if (+age < 0 || +phone < 0) return false;
    if (+age > 150) return false;
    return true;
  };

  const isCaretakersListEmpty = (): boolean => caretakers.length === 0;

  const isCaretakerDataValid = async (): Promise<boolean> => {
    if (caretakerEmail === "") {
      addNotification("Please enter an email address", NotificationType.ERROR);
      return false;
    }

    if (!(await checkEmailExists(caretakerEmail))) {
      addNotification("Email does not exist", NotificationType.ERROR);
      return false;
    }

    const emailAlreadyAdded = caretakers.some(
      (caretaker) => caretaker.email === caretakerEmail
    );

    if (emailAlreadyAdded) {
      addNotification("Caretaker already added", NotificationType.ERROR);
      return false;
    }
    return true;
  };

  const handleFormFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addCaretaker = async (
    e: React.FormEvent
  ): Promise<void | Caretaker[]> => {
    e.preventDefault();

    if (!(await isCaretakerDataValid())) return;

    const caretakerName = await getNameFromEmail(caretakerEmail);
    if (!caretakerName) return;

    setCaretakers((prevCaretakers) => [
      ...prevCaretakers,
      { name: caretakerName, email: caretakerEmail },
    ]);

    setCaretakerEmail("");
  };

  const removeCaretakerFromList = (email: string): void => {
    setCaretakers((prevCaretakers) =>
      prevCaretakers.filter((caretaker) => caretaker.email !== email)
    );
    addNotification("Caretaker removed successfully", NotificationType.SUCCESS);
  };

  const submitPatientData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      formData.caretakers = caretakers;
      const patientId = await addPatient(formData);
      setCurrentPatientId(patientId);
      if (profileImage) {
        const profilePictureUrl = await uploadProfilePicture(
          patientId,
          profileImage
        );
        if (typeof profilePictureUrl === "string") {
          setPictureUrl(profilePictureUrl);
        }
      }
      addNotification("Patient created successfully", NotificationType.SUCCESS);
    } catch {
      addNotification("Failed to create patient", NotificationType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isFormDataValid(formData)) {
      addNotification("Invalid form data", NotificationType.ERROR);
      return;
    }

    if (isCaretakersListEmpty()) {
      addNotification(
        "Please add at least one caretaker",
        NotificationType.ERROR
      );
      return;
    }

    await submitPatientData();
    navigate(Paths.HOME);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar centerContent="Create Patient" />
      <div className={styles.fullWrapper}>
        <div className={styles.profilePictureWrapper}>
          <PatientProfilePicture
            setProfileImage={setProfileImage}
            patientId=""
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.personalInfoSection} dropShadow`}>
            <h2 className={styles.headlineText}>Personal Information</h2>
            {personalInfoFields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleFormFieldChange}
                required={field.required}
                type={field.type}
              />
            ))}
          </div>
          <div className={`${styles.healthInfoSection} dropShadow`}>
            <h2 className={styles.headlineText}>Health Information</h2>
            {healthInfoFields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleFormFieldChange}
                type={field.type}
              />
            ))}
          </div>
          <div className={`${styles.caretakerInfoSection} dropShadow`}>
            <h2 className={styles.headlineText}>Assign caretakers</h2>
            <div className={styles.caretakerAndButton}>
              <FormField
                name="caretakerEmail"
                value={caretakerEmail}
                onChange={(e) => setCaretakerEmail(e.target.value)}
                type="email"
              />
              <Button type="button" onClick={addCaretaker}>
                <Icon data={add} />
              </Button>
            </div>
            <ul className={styles.caretakerList}>
              {caretakers.map((caretaker, index) => (
                <li key={index} className={styles.caretakerListItem}>
                  <div className={styles.picNameAndEmail}>
                    <img src={pictureUrl} alt="Default profile picture" />
                    <div className={styles.nameAndEmail}>
                      <h3>{caretaker.name}</h3>
                      <span>{caretaker.email}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost_icon"
                    onClick={() => removeCaretakerFromList(caretaker.email)}
                  >
                    <Icon data={remove_outlined} color="var(--lightblue)" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <Button id={styles.createPatientButton} type="submit">
            Register Patient
          </Button>
        </form>
      </div>
    </>
  );
}
