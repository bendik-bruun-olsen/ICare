import { auth } from "../../firebase/firebase";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useContext, useEffect } from "react";
import { Input, Label, Button } from "@equinor/eds-core-react";
import { Styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import "./login.modules.css";
import { useAuth } from "../../hooks/useAuth/useAuth";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const signIn = async () => {
		try {
			console.log("test");

			const userdata = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			navigate(Paths.HOME);
		} catch (err) {
			console.error(err);
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
			<div className="Image">
				{/* <img src={logo} className="App-logo" alt="logo" /> */}
			</div>
			<div className="Inputfield">
				<div>
					<Label htmlFor="textfield-normal" label="Username" />
					<Input
						id="textfield-normal"
						placeholder="e-mail ID"
						autoComplete="off"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="textfield-password" label="Password" />
					<Input
						type="password"
						placeholder="Password"
						id="textfield-password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				{/* <input
				placeholder="Enter your Email ID"
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				placeholder="Password"
				type="password"
				onChange={(e) => setPassword(e.target.value)}
			/> */}
				<Button id="SignInButton" onClick={signIn}>
					Sign In
				</Button>
				{/* <Button onClick={logout}>Logout</Button> */}
			</div>
		</>
	);
}
