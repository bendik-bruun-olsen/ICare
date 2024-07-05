import React, { useState } from "react";
import { Input, Button, InputWrapper } from "@equinor/eds-core-react";
import BannerImage from "../../assets/images/Logo.png";
import Logo from "../../components/Logo/Logo";
import "./RecoverPasswordPage.modules.css";
import styled from "styled-components";
import { sendResetEmail } from "../../utils";
import { checkUserExists } from "../../utils";
import { useNotification } from "../../context/NotificationContext";

const CustomButton = styled(Button)`
	margin-top: 1rem;

	width: 100%;

	background-color: var(--blue);
	color: var(--white);
`;
const CustomInputWrapper = styled(InputWrapper)`
	margin-top: 1rem;
	width: 100%;
	color: var(--black);
`;

export default function RecoverPasswordPage() {
	const [email, setEmail] = useState<string>("");
	const [message] = useState<string>("");
	const { addNotification } = useNotification();

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();

		const exists = await checkUserExists(email);
		try {
			if (exists) {
				await sendResetEmail(email);
				addNotification("Password reset email sent!", "success");
			} else {
				addNotification("User does not exist", "info");
			}
		} catch (error) {
			addNotification("Error sending Email.", "error");
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};
	return (
		<div className="pageWrapper">
			<div className="heading">
				<Logo size={"70px"} color={"var(--blue)"} />
			</div>

			<img src={BannerImage} alt="logo-image" className="bannerImage" />

			<form onSubmit={handleForgotPassword} className="InputContainer">
				<CustomInputWrapper
					className="input1"
					labelProps={{
						label: "Email",
						htmlFor: "textfield-normal",
						style: { display: "block" },
					}}
				>
					<Input
						type="email"
						id="email"
						value={email}
						onChange={handleEmailChange}
						required
					/>
				</CustomInputWrapper>

				<CustomButton id="sendEmail" type="submit">
					Send Email
				</CustomButton>
			</form>

			{message && <p>{message}</p>}
		</div>
	);
}
