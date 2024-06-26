import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Input, Button, InputWrapper } from "@equinor/eds-core-react";
import { Paths } from "../../paths";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./SignupPage.modules.css";
import { FirebaseError } from "firebase/app";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db = getFirestore();

    if (password === confirmPassword) {
      try {
        const userDetails = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userDetails.user;

        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
        });

        navigate(Paths.LOGIN);
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          (err as FirebaseError).code === "EMAIL_EXISTS"
        ) {
          setError("Email already in use");
          console.error("Email already in use:", err);
        } else {
          navigate(Paths.ERROR);
        }
      }
    } else {
      console.error("Password and confirm password do not match.");
      setError("Passwords do not match");
    }
  };

  return (
    <form className="inputcontainer" onSubmit={signUp}>
      {error && <div className="error-message">{error}</div>}
      <InputWrapper
        className="input"
        labelProps={{
          label: "Username",
          htmlFor: "textfield-normal",
          style: { display: "block" },
        }}
      >
        <Input value={name} onChange={handleUsernameChange} />
      </InputWrapper>
      <InputWrapper
        className="input"
        labelProps={{
          label: "Email",
          htmlFor: "textfield-normal",
          style: { display: "block" },
        }}
      >
        <Input value={email} onChange={handleEmailChange} />
      </InputWrapper>

      <InputWrapper
        className="input"
        labelProps={{
          label: "Password",
          htmlFor: "textfield-password",
          style: { display: "block" },
        }}
      >
        <Input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </InputWrapper>
      <InputWrapper
        className="input"
        labelProps={{
          label: "Confirm Password",
          htmlFor: "textfield-password",
          style: { display: "block" },
        }}
      >
        <Input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </InputWrapper>

      <Button id="signupbutton" type="submit">
        Sign Up
      </Button>
    </form>
  );
}
