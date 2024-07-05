import Navbar from "../components/Navbar/Navbar";
import BackHomeButton from "../components/BackHomeButton";

const AboutUsPage = () => {
	return (
		<>
			<Navbar leftContent={<BackHomeButton />} centerContent="About Us" />
			<div className="pageWrapper">
				<h2>About Us</h2>
			</div>
		</>
	);
};

export default AboutUsPage;
