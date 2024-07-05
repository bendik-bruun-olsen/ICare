import BackHomeButton from "../components/BackHomeButton";
import Navbar from "../components/Navbar/Navbar";

const ContactDetailsPage = () => {
	return (
		<>
			<Navbar leftContent={<BackHomeButton />} centerContent="Contact" />
			<div className="pageWrapper">
				<h2>ContactPage</h2>
			</div>
		</>
	);
};

export default ContactDetailsPage;
