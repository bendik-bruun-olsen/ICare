import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { confirmPasswordReset } from "firebase/auth";
import { Input, InputWrapper, Button } from "@equinor/eds-core-react";
import { Paths } from "../paths";
import BannerImage from "../assets/images/Logo.png";
import Logo from "./Logo/Logo";

export default function ResetPassword() {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const location = useLocation();
    const navigate = useNavigate();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(location.search);
        const oobCode = queryParams.get("oobCode");

        if (!oobCode) {
            setMessage("Invalid or expired token");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, password);
            setMessage("Password has been reset!");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
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

    return (
        <div
            className="pageWrapper"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                justifyContent: "left",
                minHeight: "100vh",
                padding: "10px",
            }}
        >
            <div className="heading">
                <Logo size={"70px"} color={"var(--blue)"} />
            </div>

            <img src={BannerImage} alt="logo-image" className="bannerImage" />
            <div
                className="formContainer"
                style={{
                    width: "100%",
                }}
            >
                <form onSubmit={handleResetPassword}>
                    <InputWrapper
                        className="input"
                        labelProps={{
                            label: "New-Password",
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
                            label: "Confirm New-Password",
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
                    <Button
                        type="submit"
                        style={{ width: "95%", marginLeft: "0.5rem" }}
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}
