import { useEffect, useState } from "react";
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
} from "../../types";
import { addPatient } from "../../firebase/patientServices/addPatient";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import { checkEmailExists } from "../../firebase/patientServices/checkEmail";
import { defaultPatientFormData } from "../../constants/defaultPatientFormData";
import PatientProfilePicture from "../../components/PatientProfilePicture/PatientProfilePicture";
import { useNotification } from "../../hooks/useNotification";
import { uploadProfilePicture } from "../../firebase/patientImageServices/patientPictureService";
import { getNameFromEmail } from "../../firebase/userServices/getNameFromEmail";

const FormField = ({
	label,
	name,
	value,
	onChange,
	required = false,
	type,
}: FormFieldProps) => (
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

export default function CreatePatientPage() {
	const { addNotification } = useNotification();
	const [isLoading, setIsLoading] = useState(false);
	const [caretakerEmail, setCaretakerEmail] = useState("");
	const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
	const [formData, setFormData] = useState<NewPatient>(defaultPatientFormData);
	const [pictureUrl, setPictureUrl] = useState("");
	const [profileImage, setProfileImage] = useState<File | null>(null);

	useEffect(() => {
		const fetchDefaultPictureUrl = async () => {
			const url = await getDefaultPictureUrl(addNotification);
			if (!url) return;
			setPictureUrl(url);
		};
		fetchDefaultPictureUrl();
	});

	const isFormDataValid = (formData: NewPatient) => {
		const { age, phone } = formData;
		if (isNaN(Number(age))) return false;
		if (isNaN(Number(phone))) return false;
		return true;
	};

	const isCaretakersListEmpty = () => caretakers.length === 0;

	const isCaretakerDataValid = async () => {
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

	const handleFormFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const addCaretaker = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!(await isCaretakerDataValid())) return;

		const caretakerName = await getNameFromEmail(caretakerEmail);

		setCaretakers((prevCaretakers) => [
			...prevCaretakers,
			{ name: caretakerName, email: caretakerEmail },
		]);

		setCaretakerEmail("");
	};

	const removeCaretakerFromList = (email: string) => {
		setCaretakers((prevCaretakers) =>
			prevCaretakers.filter((caretaker) => caretaker.email !== email)
		);
		addNotification("Caretaker removed successfully", NotificationType.SUCCESS);
	};

	// Refactor if we find a better solution
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

	const personalInfoFields = [
		{ label: "Name", name: "name", required: true, type: "text" },
		{ label: "Age", name: "age", required: false, type: "number" },
		{ label: "Phone", name: "phone", required: true, type: "number" },
		{ label: "Address", name: "address", required: true, type: "text" },
	];

	const healthInfoFields = [
		{ label: "Diagnoses", name: "diagnoses", required: false, type: "text" },
		{ label: "Allergies", name: "allergies", required: false, type: "text" },
	];

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<Navbar centerContent="Create Patient" />
			<div className={styles.fullWrapper}>
				<div className={styles.profilePictureWrapper}>
					<PatientProfilePicture setProfileImage={setProfileImage} />
				</div>
				<form onSubmit={handleSubmit}>
					<div className={`${styles.personalInfoSection} dropShadow`}>
						<h2 className={styles.headlineText}>Personal Information</h2>
						{personalInfoFields.map((field) => (
							<FormField
								key={field.name}
								label={field.label}
								name={field.name}
								value={formData[field.name] as string}
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
								value={formData[field.name] as string}
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
