import { Icon } from "@equinor/eds-core-react";
import {
  restaurant,
  group,
  walk,
  arrow_forward,
  hospital,
} from "@equinor/eds-icons";
import styles from "./RemainingTodos.module.css";
import { Link } from "react-router-dom";
import { Paths } from "../../paths";
import RemainingTodoItem from "./RemainingTodoItem";
import { ToDo } from "../../types";

interface RemainingTodosProps {
  todos: ToDo[];
}

export default function RemainingTodos({
  todos,
}: RemainingTodosProps): JSX.Element {
  const categorizedTodos = [
    { category: "Food", icon: restaurant },
    { category: "Medicine", icon: hospital },
    { category: "Social", icon: group },
    { category: "Exercise", icon: walk },
  ];

  return (
    <div className={styles.remainingTodosOuterWrapper}>
      <div className={styles.titleWrapper}>
        <h2>ToDo</h2>
        <Link to={Paths.TODO}>
          <div className={styles.arrowIconWrapper}>
            <span>All Todos</span>
            <Icon data={arrow_forward} />
          </div>
        </Link>
      </div>
      <div className={styles.remainingTodosInnerWrapper}>
        {categorizedTodos.map((category) => {
          const todosInCategory = todos.filter(
            (todo) => todo.category === category.category
          );
          const completedTodosCount = todosInCategory.filter(
            (todo) => todo.status === "checked"
          ).length;

          return (
            <RemainingTodoItem
              categoryTitle={category.category}
              completedTodosCount={completedTodosCount}
              allTodosCount={todosInCategory.length}
              icon={category.icon}
              key={category.category}
            />
          );
        })}
      </div>
    </div>
  );
}
