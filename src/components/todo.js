import React from "react";
import TodoListConnnected from "../containers/todo-list";
import AddTask from "../containers/add-task";
import "./todo.css";

const Todo = () => (
    <div className="todoListMain">
        <AddTask />
        <TodoListConnnected />
    </div>
);

export default Todo;