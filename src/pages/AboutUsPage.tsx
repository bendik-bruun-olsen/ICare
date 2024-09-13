import Logo from "../components/Logo/Logo";
import Navbar from "../components/Navbar/Navbar";

export default function AboutUsPage(): JSX.Element {
	return (
		<>
			<Navbar leftContent={<Logo />} centerContent="About Us" />
			<div className="pageWrapper">
				<h2>About Us</h2>
			</div>
		</>
	);
}
