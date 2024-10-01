import { NotificationContext, ToDo } from "../../types";
import { getTodo } from "../todoServices/getTodo";

export default async function countingTodos(
	todos: ToDo[],
	todoId: string,
	addNotification: NotificationContext["addNotification"]
): Promise<ToDo[]> {
	const todoList = await getTodo(todoId, addNotification);
	if (!todoList) {
		console.log("todoList is empty");
		return [];
	}
	console.log("todolist", todoList);

	return [];
}
