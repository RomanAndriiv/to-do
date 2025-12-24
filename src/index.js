import React, { useReducer, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { initialState, reducer } from "./reducers/todos";
import Todo from "./components/todo";
import "./index.css";

export const TodosContext = React.createContext();

const App = () => {
  const initializer = (init) => {
    if (typeof window === "undefined") return init;
    try {
      const raw = localStorage.getItem("todosState");
      if (raw) return JSON.parse(raw);
    } catch (err) {}
    return init;
  };

  const [todos, dispatch] = useReducer(reducer, initialState, initializer);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("todosState", JSON.stringify(todos));
    } catch (err) {}
  }, [todos]);

  return (
    <TodosContext.Provider
      value={{ todosState: todos, todosDispatch: dispatch }}
    >
      <Todo />
    </TodosContext.Provider>
  );
};

const container = document.getElementById("container");
const root = createRoot(container);
root.render(<App tab="home" />);
