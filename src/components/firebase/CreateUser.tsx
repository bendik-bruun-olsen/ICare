import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export const CreateUser = () => {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = async () => {
    if (password === confirmPassword) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up successfully!");

        //Insert into users collection with email as document ID
      } catch (err) {
        console.error("Error signing up: ", err);
        console.log("Error code: ", err.code);
      }
    } else {
      console.error("Password and confirm password do not match.");
    }
  };

  return (
    <>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
    </>
  );
};
