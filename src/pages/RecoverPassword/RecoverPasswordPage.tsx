import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import { Input, Button, InputWrapper } from "@equinor/eds-core-react";
import { sendPasswordResetEmail } from "firebase/auth";
import BannerImage from "../../assets/images/Logo.png";
import Logo from "../../components/Logo/Logo";
import "./RecoverPasswordPage.module.css";
import styled from "styled-components";
import checkUserExistence from "../../components/checkUserExistence";

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
    const [message, setMessage] = useState<string>("");

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userExists = await checkUserExistence(email);
            if (userExists) {
                await sendPasswordResetEmail(auth, email);
                setMessage("Password reset email sent!");
            } else {
                setMessage("User does not exist");
            }
        } catch (error) {
            setMessage(`Error sending Email.}`);
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
