import { Button, Icon, Input, InputWrapper } from "@equinor/eds-core-react";
import {
	CaretakerInformationInterface,
	FormFieldProps,
	PatientFormDataInterface,
} from "../../types";
import styles from "./PatientDetailsPage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Logo from "../../components/Logo/Logo";
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

export default function PatientDetailsPage() {
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
	const [isEditing, setIsEditing] = useState(false);
	const [isChanged, setIsChanged] = useState(false);
	const fullInfoContainerRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const fetchDefaultPictureUrl = async () => {
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

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [formData, caretakers, isChanged]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
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

		const handleBeforeUnload = () => {
			if (isChanged) {
				editPatient(formData, caretakers, formData.id);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [formData, isChanged, caretakers]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		setIsChanged(true);
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

	const handleEditClick = () => {
		setIsEditing(true);
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
			<Navbar leftContent={<Logo />} centerContent="Patient Details" />
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
				</form>
			</div>
		</>
	);
}
