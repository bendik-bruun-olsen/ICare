import { Button, Icon, Input, InputWrapper } from "@equinor/eds-core-react";
import {
  Caretaker,
  FormFieldProps,
  NewPatient,
  NotificationType,
} from "../../types";
import styles from "./PatientDetailsPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import PatientProfilePicture from "../../components/PatientProfilePicture/PatientProfilePicture";
import { useNotification } from "../../hooks/useNotification";
import { useEffect, useRef, useState } from "react";
import { checkEmailExists } from "../../firebase/patientServices/checkEmail";
import { editPatient } from "../../firebase/patientServices/editPatient";
import { defaultPatientFormData } from "../../constants/defaultPatientFormData";
import { addPatient } from "../../firebase/patientServices/addPatient";
import { uploadProfilePicture } from "../../firebase/patientImageServices/patientPictureService";
import { remove_outlined, add, edit } from "@equinor/eds-icons";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import Loading from "../../components/Loading/Loading";
import getNameFromEmail from "../../firebase/userServices/getNameFromEmail";
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

export default function PatientDetailsPage(): JSX.Element {
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [caretakerEmail, setCaretakerEmail] = useState("");
  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [formData, setFormData] = useState<NewPatient>(defaultPatientFormData);
  const [pictureUrl, setPictureUrl] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const fullInfoContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDefaultPictureUrl = async (): Promise<void> => {
      const url = await getDefaultPictureUrl(addNotification);
      if (!url) return;
      setPictureUrl(url);
    };
    fetchDefaultPictureUrl();
  });

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (isChanged) {
        editPatient(formData, caretakers, formData.id);
      }
    }, 2000);

    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [formData, caretakers, isChanged]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        fullInfoContainerRef.current &&
        !fullInfoContainerRef.current.contains(event.target as Node)
      ) {
        if (isChanged) {
          editPatient(formData, caretakers, formData.id);
        }
        setIsEditing(false);
      }
    };

    const handleBeforeUnload = (): void => {
      if (isChanged) {
        editPatient(formData, caretakers, formData.id);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData, isChanged, caretakers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setIsChanged(true);
  };

  const isCaretakersListEmpty = (): boolean => caretakers.length === 0;

  const isFormDataValid = (formData: NewPatient): boolean => {
    const { age, phone } = formData;
    if (isNaN(Number(age))) return false;
    if (isNaN(Number(phone))) return false;
    return true;
  };

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

  const submitPatientData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const patientId = await addPatient(formData, caretakers);

      if (profileImage) {
        uploadProfilePicture(profileImage, patientId);
      }
      addNotification("Patient created successfully", NotificationType.SUCCESS);
    } catch {
      addNotification("Failed to create patient", NotificationType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const addCaretaker = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!(await isCaretakerDataValid())) return;

    const caretakerName = await getNameFromEmail(caretakerEmail);

    setCaretakers((prevCaretakers) => [
      ...prevCaretakers,
      { name: caretakerName, email: caretakerEmail },
    ]);
    setCaretakerEmail("");
  };

  const deleteCaretaker = (email: string): void => {
    setCaretakers((prevCaretakers) =>
      prevCaretakers.filter((caretaker) => caretaker.email !== email)
    );
    addNotification("Caretaker removed successfully", NotificationType.SUCCESS);
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
  };

  const handleEditClick = (): void => {
    setIsEditing(true);
  };

  const personalInfoFields = [
    { label: "Name", name: "name", required: true, type: "text" },
    { label: "Age", name: "age", required: false, type: "number" },
    { label: "Phone", name: "phone", required: true, type: "number" },
    { label: "Address", name: "address", required: true, type: "text" },
  ];

  const healthInfoFields = [
    { label: "Diagnoses", name: "diagnoses", type: "text" },
    { label: "Allergies", name: "allergies", type: "text" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar centerContent="Patient Details" />
      <div className={styles.fullWrapper} ref={fullInfoContainerRef}>
        <div className={styles.profilePictureWrapper}>
          <PatientProfilePicture setProfileImage={setProfileImage} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.personalInfoSection} dropShadow`}>
            <div className={styles.headlineAndIcon}>
              <h2 className={styles.headlineText}>Personal Information</h2>
              <Button type="button" variant="ghost_icon">
                <Icon data={edit} onClick={handleEditClick} />
              </Button>
            </div>
            {personalInfoFields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                value={formData[field.name] as string}
                onChange={handleChange}
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
                value={formData[field.name] as string}
                onChange={handleChange}
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
                    onClick={() => deleteCaretaker(caretaker.email)}
                  >
                    <Icon data={remove_outlined} color="var(--lightblue)" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    </>
  );
}
