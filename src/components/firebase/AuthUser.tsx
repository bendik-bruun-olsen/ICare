import { auth } from "../../config/firebase.tsx";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export const AuthUser = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	console.log(auth?.currentUser?.email);

	const signIn = async () => {
		try {
			console.log("test");

			await signInWithEmailAndPassword(auth, email, password);
			console.log("User signed in successfully!");
		} catch (err) {
			console.error("Error logging in: ", err);
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
			console.log("User logged out successfully!");
		} catch (err) {
			console.error("Error logging out: ", err);
		}
	};

	return (
		<>
			<input
				placeholder="Email..."
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				placeholder="Password..."
				type="password"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={signIn}>Sign In</button>
			<button onClick={logout}>Logout</button>
		</>
	);
};
