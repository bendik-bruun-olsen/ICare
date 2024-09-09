import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { confirmPasswordReset } from "firebase/auth";
import { Input, InputWrapper, Button } from "@equinor/eds-core-react";
import { Paths } from "../../paths";
import BannerImage from "../../assets/images/Logo.png";
import Logo from "../../components/Logo/Logo";
import "./ResetPasswordPage.modules.css";
import { useNotification } from "../../hooks/useNotification";
import Loading from "../../components/Loading/Loading";

export default function ResetPasswordPage() {
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [message] = useState<string>("");
	const location = useLocation();
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const [isLoading, setIsLoading] = useState(false);

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		const queryParams = new URLSearchParams(location.search);
		const oobCode = queryParams.get("oobCode");

		if (!oobCode) {
			addNotification("Invalid or expired token", NotificationType.ERROR);
			return;
		}

		if (password !== confirmPassword) {
			addNotification("Passwords do not match", NotificationType.ERROR);
			return;
		}

		try {
			setIsLoading(true);
			await confirmPasswordReset(auth, oobCode, password);
			addNotification("Password has been reset!", NotificationType.SUCCESS);
		} catch (error) {
			addNotification(`Error: `, NotificationType.ERROR);
		} finally {
			setIsLoading(false);
		}
		navigate(Paths.LOGIN);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(e.target.value);
	};

	if (isLoading) return <Loading />;

	return (
		<div className="pageWrapper " id="resetWrapper">
			<div className="heading">
				<Logo size={"70px"} color={"var(--blue)"} />
			</div>

			<img src={BannerImage} alt="logo-image" className="bannerImage" />
			<div className="formContainer">
				<form onSubmit={handleResetPassword}>
					<InputWrapper
						className="input"
						labelProps={{
							label: "New password",
							htmlFor: "textfield-password",
							style: { display: "block" },
						}}
					>
						<Input
							type="password"
							id="password"
							value={password}
							onChange={handlePasswordChange}
							required
						/>
					</InputWrapper>
					<InputWrapper
						className="input"
						labelProps={{
							label: "Confirm new password",
							htmlFor: "textfield-password",
							style: { display: "block" },
						}}
					>
						<Input
							type="password"
							id="confirmPassword"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							required
						/>
					</InputWrapper>
					<Button type="submit" style={{ marginLeft: "0.5rem" }}>
						Reset Password
					</Button>
				</form>
			</div>
			{message && <p>{message}</p>}
		</div>
	);
}
