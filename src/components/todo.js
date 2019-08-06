import React from "react";
import { AddTask } from "../containers/add-task";
import { TodoList } from "../containers/todo-list";
import "./todo.css";

export const TodosContext = React.createContext();

const Todo = () => (
    <div className="todoListMain">
        <AddTask />
        <TodoList />
    </div>
);

export default Todo;