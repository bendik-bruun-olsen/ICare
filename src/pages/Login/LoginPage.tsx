import { auth } from "../../config/firebase";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useContext, useEffect } from "react";
import { Input, Label, Button } from "@equinor/eds-core-react";
import { Styled } from "styled-components";
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
      console.log("test");

      const userdata = await signInWithEmailAndPassword(auth, email, password);
      // console.log("user: ", JSON.stringify(user));

      //   return redirect(Paths.HOME);
      // }
      console.log(userdata);

      setUser(userdata);
      navigate(Paths.HOME);
      console.log("User signed in successfully!");
      console.log("user: ", user);
    } catch (err) {
      console.error("Error logging in: ", err);
      console.log("Error code: ", err.code);
    }
  };

  // const logout = async () => {
  //   try {
  //     await signOut(auth);
  //     console.log("User logged out successfully!");
  //   } catch (err) {
  //     console.error("Error logging out: ", err);
  //   }
  // };

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
            <Label htmlFor="textfield-normal" label="Username" />
            <Input
              id="textfield-normal"
              placeholder="E-mail ID"
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
        {/* <input
        placeholder="Enter your Email ID"
        onChange={(e) => setEmail(e.target.value)}
        />
        <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        /> */}
        <Button fullwidth id="SignInButton" type="submit">
          Sign In
        </Button>
        {/* <Button onClick={logout}>Logout</Button> */}
        <div>
          <a href={Paths.SIGNUP}>Sign Up</a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href={Paths.RECOVER_PASSWORD}>Forgot Password?</a>
        </div>
      </div>
    </>
  );
}
