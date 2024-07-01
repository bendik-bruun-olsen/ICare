import HomeButton from "../components/HomeButton/HomeButton";
import Navbar from "../components/Navbar/Navbar";

const ContactDetailsPage = () => {
	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="Contact" />
			<div className="pageWrapper">
				<h2>ContactPage</h2>
			</div>
		</>
	);
};

export default ContactDetailsPage;
