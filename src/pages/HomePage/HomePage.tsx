import { restaurant, group, walk, placeholder_icon } from "@equinor/eds-icons";
import RemainingTodos from "../../components/RemainingTodos/RemainingTodos";
import styles from "./HomePage.module.css";
import Navbar from "../../components/Navbar/Navbar";

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
        <RemainingTodos
          categoryTitle="Exercise"
          completedTodosCount="2"
          allTodosCount="3"
          icon={walk}
        />
      </div>
    </>
  );
};

export default HomePage;
