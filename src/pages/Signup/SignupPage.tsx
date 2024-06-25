import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Input, Button } from "@equinor/eds-core-react";
import { Paths } from "../../utils/paths";
import { useNavigate } from "react-router-dom";
import { getfirestore, doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    const db = getfirestore();

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
      } catch (err) {
        console.error("Error signing up: ", err);
      }
    } else {
      console.error("Password and confirm password do not match.");
    }
  };

  return (
    <>
      <form className="InputContainer" onSubmit={signUp}>
        <Input
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={signUp}>Sign Up</Button>
      </form>
    </>
  );
}
