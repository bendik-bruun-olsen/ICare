import { Icon } from "@equinor/eds-core-react";
import {
	restaurant,
	group,
	walk,
	placeholder_icon,
	arrow_forward,
} from "@equinor/eds-icons";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import styles from "./HomePage.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<>
			<Navbar leftContent={<h2>LogoTest</h2>} centerContent="Home" />
			<div className={styles.remainingTodosWrapper}>
				<RemainingTodos
					categoryTitle="Food"
					completedTodosCount="3"
					allTodosCount="6"
					icon={restaurant}
				/>
				<RemainingTodos
					categoryTitle="Medicine"
					completedTodosCount="2"
					allTodosCount="5"
					icon={placeholder_icon}
				/>
				<RemainingTodos
					categoryTitle="Social"
					completedTodosCount="1"
					allTodosCount="1"
					icon={group}
				/>
				<div className={styles.arrowPositionWrapper}>
					<RemainingTodos
						categoryTitle="Exercise"
						completedTodosCount="2"
						allTodosCount="3"
						icon={walk}
					/>
					<Link to="/todo">
						<div className={styles.arrowIconWrapper}>
							<p>All Todos</p>
							<Icon data={arrow_forward} />
						</div>
					</Link>
				</div>
			</div>
		</>
	);
};

export default HomePage;
