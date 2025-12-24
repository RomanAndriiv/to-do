import React, { useContext, useState } from "react";
import { AddTask } from "../containers/add-task";
import { TodoList } from "../containers/todo-list";
import { TodosContext } from "../index";
import {
  moveColumn,
  addColumn,
  deleteColumn,
  deleteTasks,
  setTasksComplete,
  moveTasksTo,
} from "../actions";
import "./todo.css";

const Todo = () => {
  const todosContext = useContext(TodosContext);
  const columns = (todosContext &&
    todosContext.todosState &&
    todosContext.todosState.columnsOrder) || ["To Do", "In Progress", "Done"];
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [newColName, setNewColName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedIds = [], setSelectedIds } = todosContext || {};
  const anySelected = selectedIds && selectedIds.length > 0;
  const [moveTarget, setMoveTarget] = useState(
    columns && columns.length ? columns[0] : "To Do"
  );

  return (
    <div className="todoListMain columnsContainer">
      <AddTask />
      <div className="searchControl">
        <input
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
        {anySelected && (
          <div className="selectionControls">
            <button
              onClick={() => {
                if (!window.confirm(`Delete ${selectedIds.length} selected?`))
                  return;
                todosContext.todosDispatch(deleteTasks(selectedIds));
                setSelectedIds([]);
              }}
            >
              Delete Selected
            </button>
            <button
              onClick={() => {
                todosContext.todosDispatch(setTasksComplete(selectedIds, true));
                setSelectedIds([]);
              }}
            >
              Mark Complete
            </button>
            <button
              onClick={() => {
                todosContext.todosDispatch(
                  setTasksComplete(selectedIds, false)
                );
                setSelectedIds([]);
              }}
            >
              Mark Incomplete
            </button>
            <select
              value={moveTarget}
              onChange={(e) => setMoveTarget(e.target.value)}
            >
              {columns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                todosContext.todosDispatch(
                  moveTasksTo(selectedIds, moveTarget)
                );
                setSelectedIds([]);
              }}
            >
              Move Selected
            </button>
            <button
              onClick={() => {
                // toggle select all: if all selected, clear; else select all ids
                const allIds = todosContext.todosState.todos.map((t) => t.id);
                const allSelected = allIds.every((id) =>
                  selectedIds.includes(id)
                );
                setSelectedIds(allSelected ? [] : allIds);
              }}
            >
              Toggle Select All
            </button>
          </div>
        )}
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
            <TodoList column={col} search={searchTerm} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
