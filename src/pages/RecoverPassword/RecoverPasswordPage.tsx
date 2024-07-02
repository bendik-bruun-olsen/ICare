import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import { Input, Button, InputWrapper } from "@equinor/eds-core-react";
import { sendPasswordResetEmail } from "firebase/auth";
import BannerImage from "../../assets/images/Logo.png";
import Logo from "../../components/Logo/Logo";
import "./RecoverPasswordPage.module.css";
import styled from "styled-components";

const CustomButton = styled(Button)`
    margin-top: 1rem;
    margin-left: 0.6rem;
    width: 100%;

    background-color: var(--blue);
    color: var(--white);
`;
const CustomInputWrapper = styled(InputWrapper)`
    margin-top: 1rem;
    width: 100%;
`;

export default function RecoverPasswordPage() {
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            setMessage("Password reset email sent!");
            if (error.code === "auth/user-not-found") {
                setMessage("User does not exist");
            } else {
                setMessage(`Error: ${error.message}`);
            }
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
                <div>
                    <CustomInputWrapper
                        className="input"
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
                </div>

                <div>
                    <CustomButton id="sendEmail" type="submit">
                        Send Email
                    </CustomButton>
                </div>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
