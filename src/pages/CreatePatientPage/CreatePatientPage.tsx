import { useEffect, useState } from "react";
import Logo from "../../components/Logo/Logo";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./CreatePatientPage.module.css";
import { InputWrapper, Input, Button, Icon } from "@equinor/eds-core-react";
import { add, remove_outlined } from "@equinor/eds-icons";
import Loading from "../../components/Loading/Loading";

import {
	CaretakerInformationInterface,
	FormFieldProps,
	PatientFormDataInterface,
} from "../../types";
import { addPatient } from "../../firebase/patientServices/addPatient";
import { getDefaultPictureUrl } from "../../firebase/patientImageServices/defaultImage";
import { checkEmailExists } from "../../firebase/patientServices/checkEmail";
import { defaultPatientFormData } from "../../constants/defaultPatientFormData";
import PatientProfilePicture from "../../components/PatientProfilePicture/PatientProfilePicture";
import { useNotification } from "../../hooks/useNotification";
import { uploadProfilePicture } from "../../firebase/patientImageServices/patientPictureService";

const FormField = ({
	label,
	name,
	value,
	onChange,
	required = false,
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
		/>
	</InputWrapper>
);

export default function CreatePatientPage() {
	const { addNotification } = useNotification();
	const [isLoading, setIsLoading] = useState(false);
	const [caretakerEmail, setCaretakerEmail] = useState("");
	const [caretakers, setCaretakers] = useState<CaretakerInformationInterface[]>(
		[]
	);
	const [formData, setFormData] = useState<PatientFormDataInterface>(
		defaultPatientFormData
	);
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const addCaretaker = async (e: React.FormEvent) => {
		e.preventDefault();
		const { exists, name } = await checkEmailExists(caretakerEmail);
		if (!exists) {
			addNotification("Email does not exist", "error");
			return;
		}

		const emailAlreadyAdded = caretakers.some(
			(caretaker) => caretaker.email === caretakerEmail
		);

		if (emailAlreadyAdded) {
			addNotification("Caretaker already added", "error");
			return;
		}

		setCaretakers((prevCaretakers) => [
			...prevCaretakers,
			{ name, email: caretakerEmail },
		]);
		setCaretakerEmail("");
	};

	const deleteCaretaker = (email: string) => {
		setCaretakers((prevCaretakers) =>
			prevCaretakers.filter((caretaker) => caretaker.email !== email)
		);
		addNotification("Caretaker removed successfully", "success");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isNaN(Number(formData.age))) {
			addNotification("Age must be a number", "error");
			return;
		}
		if (isNaN(Number(formData.phone))) {
			addNotification("Phone number must be a number", "error");
			return;
		}

		if (caretakers.length === 0) {
			addNotification("Please add at least one caretaker", "error");
			return;
		}

		try {
			setIsLoading(true);
			const patientId = await addPatient(formData, caretakers);

			if (profileImage) {
				uploadProfilePicture(profileImage, patientId);
			}
			addNotification("Patient created successfully", "success");
		} catch (err) {
			addNotification("Failed to create patient", "error");
		} finally {
			setIsLoading(false);
		}
	};

	const personalInfoFields = [
		{ label: "Name", name: "name", required: true },
		{ label: "Age", name: "age" },
		{ label: "Phone", name: "phone", required: true },
		{ label: "Address", name: "address", required: true },
	];

	const healthInfoFields = [
		{ label: "Diagnoses", name: "diagnoses" },
		{ label: "Allergies", name: "allergies" },
	];

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<Navbar centerContent="Create Patient" leftContent={<Logo />} />
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
								onChange={handleChange}
								required={field.required}
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
					<Button id={styles.createPatientButton} type="submit">
						Register Patient
					</Button>
				</form>
			</div>
		</>
	);
}
