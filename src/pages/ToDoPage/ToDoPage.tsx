import React, { useState, useEffect, useContext } from "react";
import { Button } from "@equinor/eds-core-react";
import DateSelector from "../../components/DateSelector/DateSelector";
import ToDoTile from "../../components/ToDoTile/ToDoTile";
import styles from "./ToDoPage.module.css";
import { Icon } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import Navbar from "../../components/Navbar/Navbar";
import { groupTodosByCategory, sortTodosGroup } from "../../utils";
import { NotificationType, ToDo, ToDoStatus } from "../../types";
import { Link, useLocation } from "react-router-dom";
import { getTodosBySelectedDate } from "../../firebase/todoServices/getTodo";
import ErrorPage from "../ErrorPage/ErrorPage";
import Loading from "../../components/Loading/Loading";
import { Paths } from "../../paths";
import { NotificationContext } from "../../context/NotificationContext";
import { useAuth } from "../../hooks/useAuth/useAuth";

const ToDoPage: React.FC = () => {
  const location = useLocation();
  const initialDate = location.state
    ? new Date(location.state.selectedDate)
    : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [categorizedTodos, setCategorizedTodos] = useState<{
    [key: string]: ToDo[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { addNotification } = useContext(NotificationContext);
  const { currentPatientId } = useAuth();
  const patientId = currentPatientId;

  useEffect(() => {
    if (!selectedDate) return setHasError(true);

    async function fetchData(): Promise<void> {
      if (!patientId) return;
      setIsLoading(true);
      try {
        const data = await getTodosBySelectedDate(
          selectedDate,
          patientId,
          addNotification
        );
        setIsLoading(true);
        if (data) {
          const groupedTodos = groupTodosByCategory(data as ToDo[]);
          const sortedTodosGroup = sortTodosGroup(groupedTodos);
          setCategorizedTodos(sortedTodosGroup);
        }
        if (!data || data.length === 0) {
          addNotification("No todos", NotificationType.INFO);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedDate, patientId]);

  const handleStatusChange = async (
    todoId: string,
    newStatus: ToDoStatus
  ): Promise<void> => {
    if (!categorizedTodos) return;

    const flattenedTodos = Object.values(categorizedTodos).flat();
    const todoIndex = flattenedTodos.findIndex((todo) => todo.id === todoId);
    if (todoIndex === -1) return;
    const updatedTodo = { ...flattenedTodos[todoIndex], status: newStatus };
    flattenedTodos[todoIndex] = updatedTodo;
    const updatedGroupedTodos = groupTodosByCategory(flattenedTodos);
    const updatedSortedTodosGroup = sortTodosGroup(updatedGroupedTodos);
    setCategorizedTodos(updatedSortedTodosGroup);
  };

  if (Object.keys(categorizedTodos).length === 0) {
    return (
      <>
        <Navbar centerContent="ToDo" />
        <div className={"pageWrapper " + styles.fullPage}>
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <div>
            <h2>No todos for {selectedDate.toDateString()}</h2>
            <Link to={Paths.ADD_TODO} state={{ selectedDate }}>
              <div className={styles.addIcon}>
                <Button variant="contained_icon">
                  <Icon data={add} size={32} />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (isLoading)
    return (
      <>
        <Navbar centerContent="ToDo" />
        <Loading />
      </>
    );
  if (hasError) return <ErrorPage />;
  return (
    <>
      <Navbar centerContent="ToDo" />
      <div className={"pageWrapper " + styles.fullPage}>
        <div className={styles.fullPage}>
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <div>
            {Object.keys(categorizedTodos).map((category) => (
              <div
                key={category}
                className={`${styles.categoryStyle} ${
                  category === "Ignored" ? styles.ignoreCategory : ""
                }`}
              >
                <h2>{category}</h2>
                <div className={styles.toDoTilesWrapper}>
                  {categorizedTodos[category].map((todo) => (
                    <div className={styles.toDoTile} key={todo.id}>
                      <ToDoTile
                        selectedDate={selectedDate}
                        todoItem={todo}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Link to={Paths.ADD_TODO} state={{ selectedDate }}>
              <div className={styles.addIcon}>
                <Button variant="contained_icon">
                  <Icon data={add} size={32} />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToDoPage;
