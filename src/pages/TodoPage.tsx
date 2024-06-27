import Navbar from "../components/Navbar/Navbar";
import HomeButton from "../components/HomeButton/HomeButton";

const TodoPage = () => {
	return (
		<>
			<Navbar leftContent={<HomeButton />} centerContent="Todo" />
			<div className="pageWrapper">
				<h2>TodoPage</h2>
			</div>
		</>
	);
};

export default TodoPage;
