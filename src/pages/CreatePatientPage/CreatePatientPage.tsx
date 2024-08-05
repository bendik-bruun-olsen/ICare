import { useState } from "react";
import Logo from "../../components/Logo/Logo";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./CreatePatientPage.module.css";
import { InputWrapper, Input, Button } from "@equinor/eds-core-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNotification } from "../../context/NotificationContext";
import LoadingPage from "../LoadingPage";

type FormFieldProps = {
	label: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
};

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
	const [formData, setFormData] = useState<{
		name: string;
		age: string;
		phone: string;
		address: string;
		diagnoses: string;
		allergies: string;
		[key: string]: string;
	}>({
		name: "",
		age: "",
		phone: "",
		address: "",
		diagnoses: "",
		allergies: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const patientRef = collection(db, "patientdetails");
			await addDoc(patientRef, formData);
			setFormData({
				name: "",
				age: "",
				phone: "",
				address: "",
				diagnoses: "",
				allergies: "",
			});
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
		return <LoadingPage />;
	}

	return (
		<>
			<Navbar centerContent="Create Patient" leftContent={<Logo />} />
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.personalInfoSection}>
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
					<div className={styles.healthInfoSection}>
						<h2 className={styles.headlineText}>Health Information</h2>
						{healthInfoFields.map((field) => (
							<FormField
								key={field.name}
								label={field.label}
								name={field.name}
								value={formData[field.name]}
								onChange={handleChange}
							/>
						))}
					</div>
					<Button id={styles.createPatientButton} type="submit">
						Register Patient
					</Button>
				</form>
			</div>
		</>
	);
}
