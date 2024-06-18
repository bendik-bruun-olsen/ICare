import { restaurant, group, walk, placeholder_icon } from "@equinor/eds-icons";
import RemainingTodos from "../components/RemainingTodos/RemainingTodos";

const Home = () => {
	return (
		<>
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
			<RemainingTodos
				categoryTitle="Exercise"
				completedTodosCount="2"
				allTodosCount="3"
				icon={walk}
			/>
		</>
	);
};

export default Home;
