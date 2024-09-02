import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Input, Label, Button } from "@equinor/eds-core-react";
import BannerImage from "../../assets/images/Logo.png";
import Logo from "../../components/Logo/Logo";
import { Paths } from "../../paths";
import styles from "./LoginPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import { FirestoreError } from "firebase/firestore";
import { useNotification } from "../../hooks/useNotification";
import Loading from "../../components/Loading/Loading";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMessage] = useState<string | undefined>("");
  const [hasError, setHasError] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasValidationError = false;

    if (!email) {
      setEmailError("Email is required.");
      hasValidationError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      hasValidationError = true;
    }
    if (hasValidationError) {
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      addNotification("Login successful!", "success");
      navigate(Paths.HOME);
    } catch (err) {
      const error = err as FirestoreError;
      if (
        error.message.includes("auth/invalid-email") ||
        error.message.includes("auth/invalid-credential")
      ) {
        setPasswordError("Invalid email or password.");
        addNotification(
          "Invalid login credentials. Please try again.",
          "error"
        );
      } else {
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (hasError) navigate(Paths.ERROR);
  if (isLoading) return <Loading />;

  return (
    <div className="loginPageWrapper">
      <div className={styles.heading}>
        <Logo size={"70px"} color={"var(--blue)"} />
      </div>

      <img src={BannerImage} alt="logo-image" className={styles.bannerImage} />

      {notificationMessage && (
        <div className="notification">{notificationMessage}</div>
      )}

      <form className={styles.inputContainer} onSubmit={signIn}>
        <div className="inputBackgroundBox">
          <div className={styles.input}>
            <Label htmlFor="textfield-normal" label="Email" />
            <Input
              type="email"
              id="textfield-normal"
              autoComplete="off"
              onChange={handleEmailChange}
              value={email}
              variant={emailError ? "error" : undefined}
            />
            {emailError && <span className="error-text">{emailError}</span>}
          </div>

          <div className={styles.input}>
            <Label htmlFor="textfield-password" label="Password" />
            <Input
              type="password"
              autoComplete="off"
              id="textfield-password"
              onChange={handlePasswordChange}
              value={password}
              variant={passwordError ? "error" : undefined}
            />
            {passwordError && (
              <span className="error-text">{passwordError}</span>
            )}
          </div>

          <Button id="signInButton" type="submit">
            Sign In
          </Button>
        </div>
      </form>
      <div className={styles.links}>
        <Link to={Paths.SIGNUP}>Sign up!</Link>
        <Link to={Paths.RECOVER_PASSWORD}>Forgot Password?</Link>
      </div>
    </div>
  );
}
