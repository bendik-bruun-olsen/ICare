import Logo from "../components/Logo/Logo";
import Navbar from "../components/Navbar/Navbar";

export default function ContactDetailsPage(): JSX.Element {
	return (
		<>
			<Navbar leftContent={<Logo />} centerContent="Contact" />
			<div className="pageWrapper">
				<h2>ContactPage</h2>
			</div>
		</>
	);
}
