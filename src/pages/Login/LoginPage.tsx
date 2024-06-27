import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Input, Label, Button } from "@equinor/eds-core-react";
import BannerImage from "../../assets/images/Logo.png";
import Logo from "../../components/Logo/Logo";
import headline from "../../assets/images/headline.png";
import { Paths } from "../../paths";
import "./LoginPage.modules.css";
import { useNavigate } from "react-router-dom";
import { FirestoreError } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMessage, setNotificationMessage] = useState<
    string | undefined
  >("");
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(Paths.HOME);
    } catch (err) {
      const error = err as FirestoreError;
      if (
        error.message.includes("auth/invalid-email") ||
        error.message.includes("auth/invalid-credential")
      ) {
        setNotificationMessage("Invalid login credentials. Please try again.");
      } else {
        setHasError(true);
      }
    }
  };

  if (hasError) navigate(Paths.ERROR);

  return (
    <div className="pageWrapper">
      <div className="LoginPageElements">
        <div className="heading">
          <Logo size={"70px"} color={"var(--blue)"} />
        </div>

        <div className="Image">
          <img src={BannerImage} alt="logo-image" />
        </div>
        {notificationMessage && (
          <div className="notification">{notificationMessage}</div>
        )}
        <form className="InputContainer" onSubmit={signIn}>
          <div className="input">
            <Label htmlFor="textfield-normal" label="Username" />
            <Input
              id="textfield-normal"
              placeholder="E-mail"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <Label htmlFor="textfield-password" label="Password" />
            <Input
              type="password"
              placeholder="Password"
              id="textfield-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>

        <Button id="SignInButton" type="submit" onClick={signIn}>
          Sign In
        </Button>
        <div>
          <a href={Paths.SIGNUP}>Sign Up</a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href={Paths.RECOVER_PASSWORD}>Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
