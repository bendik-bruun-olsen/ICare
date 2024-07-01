import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    Input,
    Button,
    InputWrapper,
    Typography,
} from "@equinor/eds-core-react";
import { Paths } from "../../paths";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./SignupPage.modules.css";
import { FirebaseError } from "firebase/app";
import Logo from "../../components/Logo/Logo";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [hasError, setHasError] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setErrors({ ...errors, name: false });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors({ ...errors, email: false });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrors({ ...errors, password: false });
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value);
        setErrors({ ...errors, confirmPassword: false });
    };

    const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = { ...errors };

        if (name === "") {
            newErrors.name = true;
        }
        if (email === "") {
            newErrors.email = true;
        }
        if (password === "") {
            newErrors.password = true;
        }
        if (confirmPassword === "") {
            newErrors.confirmPassword = true;
        }

        if (password !== confirmPassword) {
            setNotificationMessage("Passwords do not match");
            return;
        }
        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            return;
        }
        try {
            const userDetails = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userDetails.user;

            await setDoc(doc(db, "users", email), {
                name: name,
                email: email,
            });

            navigate(Paths.LOGIN);
        } catch (err) {
            const error = err as FirebaseError;
            const emailAlreadyInUse = error.message.includes(
                "auth/email-already-in-use"
            );
            const weakPassword = error.message.includes("auth/weak-password");

            if (emailAlreadyInUse) {
                setNotificationMessage("Email already in use");
                return;
            }
            if (weakPassword) {
                setNotificationMessage("Password is too weak");
                return;
            }
            setHasError(true);
        }
    };

    if (hasError) navigate(Paths.ERROR);

    return (
        <div className="pageWrapper">
            {notificationMessage && (
                <Typography variant="caption" color="danger">
                    {notificationMessage}
                </Typography>
            )}
            <div className="heading">
                <Logo size={"60px"} color={"var(--blue)"} />
            </div>
            <form className="inputcontainer" onSubmit={signUp}>
                <InputWrapper
                    className="input"
                    labelProps={{
                        label: "Name*",
                        htmlFor: "textfield-normal",
                        style: { display: "block" },
                    }}
                >
                    <Input
                        value={name}
                        onChange={handleUsernameChange}
                        variant={errors.name ? "error" : "default"}
                        helperText={errors.name ? "Name is required" : ""}
                    />
                </InputWrapper>
                <InputWrapper
                    className="input"
                    labelProps={{
                        label: "Email*",
                        htmlFor: "textfield-normal",
                        style: { display: "block" },
                    }}
                >
                    <Input
                        value={email}
                        onChange={handleEmailChange}
                        variant={errors.email ? "error" : "default"}
                        helperText={errors.email ? "Email is required" : ""}
                    />
                </InputWrapper>

                <InputWrapper
                    className="input"
                    labelProps={{
                        label: "Password*",
                        htmlFor: "textfield-password",
                        style: { display: "block" },
                    }}
                >
                    <Input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        variant={errors.password ? "error" : "default"}
                        helperText={
                            errors.password ? "Password is required" : ""
                        }
                    />
                </InputWrapper>
                <InputWrapper
                    className="input"
                    labelProps={{
                        label: "Confirm Password*",
                        htmlFor: "textfield-password",
                        style: { display: "block" },
                    }}
                >
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        variant={errors.confirmPassword ? "error" : "default"}
                        helperText={
                            errors.confirmPassword
                                ? "Confirm Password is required"
                                : ""
                        }
                    />
                </InputWrapper>

                <Button id="signupbutton" type="submit">
                    Sign Up
                </Button>
            </form>
        </div>
    );
}
