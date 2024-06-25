import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useContext } from "react";
import { Input, Button } from "@equinor/eds-core-react";

import { StateContext } from "../../context/StateContext";
import Logo from "../../assets/images/Logo.png";
import headline from "../../assets/images/headline.png";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../utils/paths";
import "./LoginPage.modules.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(StateContext);
  const { user, setUser } = context;
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      const userdata = await signInWithEmailAndPassword(auth, email, password);

      setUser(userdata);
      navigate(Paths.HOME);
    } catch (err) {
      console.error("Error logging in: ", err);
    }
  };

  return (
    <>
      <div className="LoginPageElements">
        <div className="heading">
          <img src={headline} className="App-headline" alt="logo" />
        </div>

        <div className="Image">
          <img src={Logo} className="App-logo" alt="logo image" />
        </div>
        <form className="InputContainer" onSubmit={signIn}>
          <div className="input">
            <Input
              id="textfield-normal"
              placeholder="E-mail"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <Input
              type="password"
              placeholder="Password"
              id="textfield-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button id="SignInButton" type="submit">
            Sign In
          </Button>
        </form>

        <div>
          <a href={Paths.SIGNUP}>Sign Up</a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href={Paths.RECOVER_PASSWORD}>Forgot Password?</a>
        </div>
      </div>
    </>
  );
}
