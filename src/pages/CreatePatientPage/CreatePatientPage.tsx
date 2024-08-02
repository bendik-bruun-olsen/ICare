import { useState } from "react";
import Logo from "../../components/Logo/Logo";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./CreatePatientPage.module.css";
import { InputWrapper, Input, Button } from "@equinor/eds-core-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";

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
		className="input"
		labelProps={{
			label: label,
			htmlFor: "textfield-normal",
			style: { display: "block" },
		}}
	>
		<Input required={required} name={name} value={value} onChange={onChange} />
	</InputWrapper>
);

export default function CreatePatientPage() {
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
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
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
			setError("Failed to create patient. Please try again.");
		}
	};

	const personalInfoFields = [
		{ label: "Name*", name: "name", required: true },
		{ label: "Age", name: "age" },
		{ label: "Phone*", name: "phone", required: true },
		{ label: "Address*", name: "address", required: true },
	];

	const healthInfoFields = [
		{ label: "Diagnoses", name: "diagnoses" },
		{ label: "Allergies", name: "allergies" },
	];

	return (
		<>
			<Navbar centerContent="Create Patient" leftContent={<Logo />} />
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className={styles.personalInfoSection}>
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
					{error && <p style={{ color: "red" }}>{error}</p>}
					<Button id={styles.createPatientButton} type="submit">
						Create Patient
					</Button>
				</form>
			</div>
		</>
	);
}
