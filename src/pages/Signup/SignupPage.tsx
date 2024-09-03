import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Label, Input, Button } from "@equinor/eds-core-react";
import { Paths } from "../../paths";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import styles from "./SignupPage.module.css";
import { FirebaseError } from "firebase/app";
import Logo from "../../components/Logo/Logo";
import { useNotification } from "../../hooks/useNotification";
import Loading from "../../components/Loading/Loading";

const initialErrorState = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
};

export default function SignupPage() {
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>(
    initialErrorState
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateForm = () => {
    const updatedErrors = { ...initialErrorState };

    updatedErrors.name = !formData.name;
    updatedErrors.email = !formData.email;
    updatedErrors.password = !formData.password;
    updatedErrors.confirmPassword = !formData.confirmPassword;

    const passwordsMatch = formData.password === formData.confirmPassword;

    if (!passwordsMatch) {
      addNotification("Passwords do not match", "error");
      updatedErrors.password = true;
      updatedErrors.confirmPassword = true;
    }
    setErrors(updatedErrors);
    return !Object.values(updatedErrors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "users", formData.email), {
        name: formData.name,
        email: formData.email,
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
      navigate(Paths.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  const renderInput = (label: string, name: string, type: string) => (
    <>
      <div className={styles.labelContainer}>
        <Label label={label} htmlFor={name}>
          {label}
        </Label>
        <span className={styles.requiredStar}>*</span>
      </div>
      <Input
        className={styles.input}
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        variant={errors[name] ? "error" : undefined}
      />
    </>
  );

  return (
    <div className="pageWrapper">
      <div className={styles.heading}>
        <Logo size="60px" color="var(--blue)" />
      </div>
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <div className={styles.inputBackgroundBox}>
          {renderInput("Name", "name", "text")}
          {renderInput("Email", "email", "email")}
          {renderInput("Password", "password", "password")}
          {renderInput("Confirm Password", "confirmPassword", "password")}
        </div>
        <div className={styles.links}>
          <Button id="signupButton" type="submit">
            Sign Up
          </Button>
          <Link to={Paths.LOGIN} className={styles.backToLogin}>
            Back to Login page
          </Link>
        </div>
      </form>
    </div>
  );
}
