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

export default function SignupPage() {
  const [formData, setFormData] = useState<{
    [key: string]: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { ...errors };

    ["name", "email", "password", "confirmPassword"].forEach((field) => {
      if (!formData[field]) newErrors[field] = true;
    });
    const passwordsMatch = formData.password === formData.confirmPassword;
    if (!passwordsMatch) {
      addNotification("Passwords do not match", "error");
      return;
    }
    const validationErrors = Object.keys(newErrors).length > 0;
    if (validationErrors) {
      setErrors(newErrors);
      return;
    }

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

  const renderInput = (
    label: string,
    name: string,
    type: string = "text",
    required: boolean = true
  ) => (
    <>
      <Label label={label} htmlFor={name}>
        {label}
        {required && <span className={styles.requiredStar}>*</span>}
      </Label>
      <Input
        className={styles.input}
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        helperText={errors[name] ? `${label} is required` : ""}
        variant={errors[name] ? "error" : undefined}
        required={required}
      />
    </>
  );

  return (
    <div className="pageWrapper">
      <div className="heading">
        <Logo size="60px" color="var(--blue)" />
      </div>
      <form className={styles.inputContainer} onSubmit={signUp}>
        <div className={styles.inputBackgroundBox}>
          {renderInput("Name", "name", "text", true)}
          {renderInput("Email", "email", "email", true)}
          {renderInput("Password", "password", "password", true)}
          {renderInput("Confirm Password", "confirmPassword", "password", true)}
        </div>
        <div className={styles.links}>
          <Button id="signupbutton" type="submit">
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
