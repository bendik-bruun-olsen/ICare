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
  const [hasError, setHasError] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

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

    if (password !== confirmPassword) {
      setNotificationMessage("Passwords do not match");
      return;
    }

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
        <div className="notification">{notificationMessage}</div>
      )}
      <form className="inputcontainer" onSubmit={signUp}>
        <InputWrapper
          className="input"
          labelProps={{
            label: "Name",
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
    </div>
  );
}
