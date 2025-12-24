import React, { useContext, useRef } from "react";
import { addTask } from "../actions";
import { TodosContext } from "../index";

export const AddTask = () => {
  const inputEl = useRef(null);
  const selectEl = useRef(null);
  const todosContext = useContext(TodosContext);

  const addTodo = (e) => {
    e.preventDefault();

    if (inputEl.current.value.trim() !== "") {
      const column = selectEl.current.value;
      todosContext.todosDispatch(addTask(inputEl.current.value, column));
      inputEl.current.value = "";
    }
  };

  return (
    <div className="header">
      <form onSubmit={addTodo}>
        <input ref={inputEl} placeholder="enter task"></input>
        <select ref={selectEl} defaultValue="To Do">
          {(todosContext &&
          todosContext.todosState &&
          todosContext.todosState.columnsOrder
            ? todosContext.todosState.columnsOrder
            : ["To Do", "In Progress", "Done"]
          ).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button type="submit">add</button>
      </form>
    </div>
  );
};
