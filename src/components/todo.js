import React, { useContext, useState } from "react";
import { AddTask } from "../containers/add-task";
import { TodoList } from "../containers/todo-list";
import { TodosContext } from "../index";
import { moveColumn, addColumn, deleteColumn } from "../actions";
import "./todo.css";

const Todo = () => {
  const todosContext = useContext(TodosContext);
  const columns = (todosContext &&
    todosContext.todosState &&
    todosContext.todosState.columnsOrder) || ["To Do", "In Progress", "Done"];
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [newColName, setNewColName] = useState("");

  return (
    <div className="todoListMain columnsContainer">
      <AddTask />
      <div className="columnsControls">
        <input
          value={newColName}
          onChange={(e) => setNewColName(e.target.value)}
          placeholder="New column name"
        />
        <button
          onClick={() => {
            const name = newColName && newColName.trim();
            if (!name) return;
            todosContext.todosDispatch(addColumn(name));
            setNewColName("");
          }}
        >
          Add Column
        </button>
      </div>
      <div className="columns" onDragOver={(e) => e.preventDefault()}>
        {columns.map((col, idx) => (
          <div
            className={`column ${dragOverIdx === idx ? "over" : ""}`}
            key={col}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIdx(idx);
            }}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={(e) => {
              e.preventDefault();
              const data = e.dataTransfer.getData("text/column");
              if (!data) return;
              const from = parseInt(data, 10);
              if (Number.isNaN(from)) {
                setDragOverIdx(null);
                return;
              }
              const to = idx;
              setDragOverIdx(null);
              if (from !== to) {
                todosContext.todosDispatch(moveColumn(from, to));
              }
            }}
          >
            <h2 className="columnTitle">
              {col}
              <button
                className="dragHandle"
                draggable
                aria-label={`Drag column ${col}`}
                onDragStart={(e) => {
                  // set only the column index so columns don't react to task drags
                  e.dataTransfer.setData("text/column", String(idx));
                  e.dataTransfer.effectAllowed = "move";
                  setDragOverIdx(idx);
                }}
                onDragEnd={() => setDragOverIdx(null)}
              >
                ≡
              </button>
              <button
                className="deleteColumn"
                onClick={() => {
                  if (!window.confirm(`Delete column "${col}"?`)) return;
                  todosContext.todosDispatch(deleteColumn(idx));
                }}
              >
                ×
              </button>
            </h2>
            <TodoList column={col} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
