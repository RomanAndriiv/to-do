import React, { useContext, useState } from "react";
import { AddTask } from "../containers/add-task";
import { TodoList } from "../containers/todo-list";
import { TodosContext } from "../index";
import { moveColumn } from "../actions";
import "./todo.css";

const Todo = () => {
  const todosContext = useContext(TodosContext);
  const columns = (todosContext &&
    todosContext.todosState &&
    todosContext.todosState.columnsOrder) || ["To Do", "In Progress", "Done"];
  const [dragOverIdx, setDragOverIdx] = useState(null);

  return (
    <div className="todoListMain columnsContainer">
      <AddTask />
      <div className="columns" onDragOver={(e) => e.preventDefault()}>
        {columns.map((col, idx) => (
          <div
            className={`column ${dragOverIdx === idx ? "over" : ""}`}
            key={col}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(idx));
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIdx(idx);
            }}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={(e) => {
              e.preventDefault();
              const data = e.dataTransfer.getData("text/plain");
              if (!data) return;
              const from = parseInt(data, 10);
              const to = idx;
              setDragOverIdx(null);
              if (from !== to) {
                todosContext.todosDispatch(moveColumn(from, to));
              }
            }}
          >
            <h2 className="columnTitle">{col}</h2>
            <TodoList column={col} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
