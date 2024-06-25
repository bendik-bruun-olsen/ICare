import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Input, Label, Button } from "@equinor/eds-core-react";
import { Styled } from "styled-components";
import Logo from "../../assets/images/Logo.png";
import headline from "../../assets/images/headline.png";
import { Paths } from "../../paths";
import "./LoginPage.modules.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const signIn = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
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
		</>
	);
}
