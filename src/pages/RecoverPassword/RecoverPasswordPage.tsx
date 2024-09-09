import React, { useState } from "react";
import { Input, Button, InputWrapper } from "@equinor/eds-core-react";
import BannerImage from "../../assets/images/Logo.png";
import Logo from "../../components/Logo/Logo";
import styles from "./RecoverPasswordPage.module.css";
import styled from "styled-components";
import { sendResetEmail } from "../../utils";
import { checkUserExists } from "../../utils";
import { useNotification } from "../../hooks/useNotification";
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";

export default function RecoverPasswordPage() {
	const [email, setEmail] = useState<string>("");
	const [message] = useState<string>("");
	const { addNotification } = useNotification();
	const [isLoading, setIsLoading] = useState(false);

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();

		const exists = await checkUserExists(email);
		try {
			setIsLoading(true);
			if (exists) {
				await sendResetEmail(email);
				addNotification("Password reset email sent!", NotificationType.SUCCESS);
			} else {
				addNotification("User does not exist", NotificationType.ERROR);
			}
		} catch (error) {
			addNotification("Error sending Email.", NotificationType.ERROR);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	if (isLoading) return <Loading />;

	return (
		<div className="pageWrapper">
			<div className={styles.heading}>
				<Logo size={"70px"} color={"var(--blue)"} />
			</div>

			<img src={BannerImage} alt="logo-image" className={styles.bannerImage} />

			<form onSubmit={handleForgotPassword} className="inputContainer">
				<div className="inputBackgroundBox">
					<div className={styles.sendEmailContainer}>
						<InputWrapper
							className="input1"
							labelProps={{
								label: "Email",
								htmlFor: "textfield-normal",
							}}
						>
							<Input
								type="email"
								id="email"
								value={email}
								onChange={handleEmailChange}
								required
							/>
						</InputWrapper>
					</div>
				</div>
				<div className={styles.links}>
					<Button id="sendEmail" type="submit">
						Send Email
					</Button>
					<Link to={Paths.LOGIN} className={styles.backToLogin}>
						Back to Login page
					</Link>
				</div>
			</form>

			{message && <p>{message}</p>}
		</div>
	);
}
