import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const TodoPage = () => {
  const [todoByCategory, setTodoByCategory] = useState<{
    [key: string]: any[];
  }>({});

  useEffect(() => {
    const fetchTodoList = async () => {
      try {
        const todoListSnapshot = await getDocs(
          collection(db, "patientdetails", "patient@patient.com", "todos")
        );
        const todoList = todoListSnapshot.docs.map((doc) => doc.data());

        // Group by Category
        const todoGroupByCategory: { [key: string]: any[] } = {};
        todoList.forEach((todo) => {
          if (todo.category in todoGroupByCategory) {
            todoGroupByCategory[todo.category].push(todo);
          } else {
            todoGroupByCategory[todo.category] = [todo];
          }
        });

        setTodoByCategory(todoGroupByCategory);
      } catch (error) {
        console.error("Error fetching todo list", error);
      }
    };

    fetchTodoList();
  }, []);

  return (
    <div>
      {Object.entries(todoByCategory).map(([category, todos]) => (
        <div key={category}>
          <h1>{category}</h1>
          {todos.map((todo) => (
            <div key={todo.id}>
              <h3>
                {todo.title} - {todo.time}
              </h3>
              <p>{todo.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TodoPage;
