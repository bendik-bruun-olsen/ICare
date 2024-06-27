import { restaurant, group, walk, placeholder_icon } from "@equinor/eds-icons";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import styles from "./HomePage.module.css";
import AddToDo from "../AddTodo/AddTodo";
import TodoPage from "../TodoPage";

const Home = () => {
  return (
    <>
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
        <RemainingTodos
          categoryTitle="Exercise"
          completedTodosCount="2"
          allTodosCount="3"
          icon={walk}
        />
        <AddToDo />
        <TodoPage />
      </div>
    </>
  );
};

export default Home;