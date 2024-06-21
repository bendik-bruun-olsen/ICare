import DatePickerComponent from "../components/DatePicker/DatePickerComponent";
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
	return (
		<>
			<Navbar leftContent={<h2>LogoTest</h2>} centerContent="Home" />
			<h1>Homepage</h1>
			<DatePickerComponent />
		</>
	);
};

export default Home;
