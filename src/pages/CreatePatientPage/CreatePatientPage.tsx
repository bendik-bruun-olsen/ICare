import { useState } from "react";
import Logo from "../../components/Logo/Logo";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./CreatePatientPage.module.css";
import { InputWrapper, Input, Button } from "@equinor/eds-core-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function CreatePatientPage() {
	const [personalInfo, setPersonalInfo] = useState({
		name: "",
		age: "",
		phone: "",
		address: "",
	});
	const [healthInfo, setHealthInfo] = useState({
		diagnoses: "",
		allergies: "",
	});
	const [error, setError] = useState<string | null>(null);

	const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPersonalInfo((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleHealthInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setHealthInfo((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			const patientRef = collection(db, "patientdetails");
			await addDoc(patientRef, {
				personalInfo,
				healthInfo,
			});
			setPersonalInfo({
				name: "",
				age: "",
				phone: "",
				address: "",
			});
			setHealthInfo({
				diagnoses: "",
				allergies: "",
			});
		} catch (err) {
			setError("Failed to create patient. Please try again.");
		}
	};

	return (
		<>
			<Navbar centerContent="Create Patient" leftContent={<Logo />} />
			<div className="pageWrapper">
				<form onSubmit={handleSubmit}>
					<div className="personalInfoSection">
						<InputWrapper
							className="input"
							labelProps={{
								label: "Name*",
								htmlFor: "textfield-normal",
								style: { display: "block" },
							}}
						>
							<Input
								required
								name="name"
								value={personalInfo.name}
								onChange={handlePersonalInfoChange}
							/>
						</InputWrapper>
						<InputWrapper
							className="input"
							labelProps={{
								label: "Age",
								htmlFor: "textfield-normal",
								style: { display: "block" },
							}}
						>
							<Input
								name="age"
								value={personalInfo.age}
								onChange={handlePersonalInfoChange}
							/>
						</InputWrapper>
						<InputWrapper
							className="input"
							labelProps={{
								label: "Phone*",
								htmlFor: "textfield-normal",
								style: { display: "block" },
							}}
						>
							<Input
								required
								name="phone"
								value={personalInfo.phone}
								onChange={handlePersonalInfoChange}
							/>
						</InputWrapper>
						<InputWrapper
							className="input"
							labelProps={{
								label: "Address*",
								htmlFor: "textfield-normal",
								style: { display: "block" },
							}}
						>
							<Input
								required
								name="address"
								value={personalInfo.address}
								onChange={handlePersonalInfoChange}
							/>
						</InputWrapper>
					</div>
					<div className="healthInfoSection">
						<InputWrapper
							className="input"
							labelProps={{
								label: "Diagnoses",
								htmlFor: "textfield-normal",
								style: { display: "block" },
							}}
						>
							<Input
								name="diagnoses"
								value={healthInfo.diagnoses}
								onChange={handleHealthInfoChange}
							/>
						</InputWrapper>
						<InputWrapper
							className="input"
							labelProps={{
								label: "Allergies",
								htmlFor: "textfield-normal",
								style: { display: "block" },
							}}
						>
							<Input
								name="allergies"
								value={healthInfo.allergies}
								onChange={handleHealthInfoChange}
							/>
						</InputWrapper>
					</div>
					{error && <p style={{ color: "red" }}>{error}</p>}
					<Button id="createPatientButton" type="submit">
						Create Patient
					</Button>
				</form>
			</div>
		</>
	);
}
