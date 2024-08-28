import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Label, Input, Button, Typography } from "@equinor/eds-core-react";
import { Paths } from "../../paths";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import "./SignupPage.modules.css";
import { FirebaseError } from "firebase/app";
import Logo from "../../components/Logo/Logo";
import { useNotification } from "../../hooks/useNotification";
import Loading from "../../components/Loading/Loading";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const [hasError, setHasError] = useState(false);

    const [notificationMessage] = useState("");
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const { addNotification } = useNotification();

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

        if (!name) {
            newErrors.name = true;
        }
        if (!email) {
            newErrors.email = true;
        }
        if (!password) {
            newErrors.password = true;
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = true;
        }

        if (password !== confirmPassword) {
            addNotification("Passwords do not match", "error");
            return;
        }
        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            return;
        }
        try {
            setIsLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, "users", email), {
                name: name,
                email: email,
            });
            addNotification("You have successfully signed up!", "success");
            navigate(Paths.LOGIN);
        } catch (err) {
            const error = err as FirebaseError;
            const emailAlreadyInUse = error.message.includes(
                "auth/email-already-in-use"
            );
            const weakPassword = error.message.includes("auth/weak-password");

            if (emailAlreadyInUse) {
                addNotification("Email already in use", "info");
                return;
            }
            if (weakPassword) {
                addNotification("Password is too weak", "error");
                return;
            }
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (hasError) navigate(Paths.ERROR);
    if (isLoading) return <Loading />;

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
            <form className="inputContainer" onSubmit={signUp}>
                <Label
                    htmlFor="textfield-normal"
                    label="Name"
                    className="input"
                />

                <Input
                    value={name}
                    onChange={handleUsernameChange}
                    helperText={errors.name ? "Name is required" : ""}
                    variant={errors.name ? "error" : undefined}
                    required
                />
                <Label
                    htmlFor="textfield-normal"
                    label="Email*"
                    className="input"
                ></Label>

                <Input
                    value={email}
                    onChange={handleEmailChange}
                    helperText={errors.email ? "Email is required" : ""}
                    variant={errors.email ? "error" : undefined}
                    required
                />
                <Label
                    htmlFor="textfield-normal"
                    label="Password*"
                    className="input"
                ></Label>

                <Input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    helperText={errors.password ? "Password is required" : ""}
                    variant={errors.password ? "error" : undefined}
                    required
                />

                <Label
                    htmlFor="textfield-normal"
                    label="Confirm Password*"
                    className="input"
                ></Label>

                <Input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    helperText={
                        errors.confirmPassword
                            ? "Confirm Password is required"
                            : ""
                    }
                    variant={errors.confirmPassword ? "error" : undefined}
                    required
                />
                <div className="links">
                    <Button id="signupbutton" type="submit">
                        Sign Up
                    </Button>

                    <Link to={Paths.LOGIN} id="backToLogin">
                        Back to Login page
                    </Link>
                </div>
            </form>
        </div>
    );
}
