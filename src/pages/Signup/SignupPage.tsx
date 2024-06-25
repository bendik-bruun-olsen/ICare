import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Input, Button } from "@equinor/eds-core-react";
import { Paths } from "../../utils/paths";
import { useNavigate } from "react-router-dom";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    if (password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);

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
