import Navbar from "../components/Navbar/Navbar";
import HomeButton from "../components/HomeButton/HomeButton";

const AboutUsPage = () => {
	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="About Us" />
			<div className="pageWrapper">
				<h2>About Us</h2>
			</div>
		</>
	);
};

export default AboutUsPage;
