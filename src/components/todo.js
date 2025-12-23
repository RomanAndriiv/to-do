import React from "react";
import { AddTask } from "../containers/add-task";
import { TodoList } from "../containers/todo-list";
import "./todo.css";

const columns = ["To Do", "In Progress", "Done"];

const Todo = () => (
  <div className="todoListMain columnsContainer">
    <AddTask />
    <div className="columns">
      {columns.map((col) => (
        <div className="column" key={col}>
          <h2 className="columnTitle">{col}</h2>
          <TodoList column={col} />
        </div>
      ))}
    </div>
  </div>
);

export default Todo;
