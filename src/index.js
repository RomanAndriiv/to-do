import React, { useReducer } from "react";
import { createRoot } from 'react-dom/client';
import { initialState, reducer } from "./reducers/todos";
import Todo from "./components/todo";
import "./index.css";

export const TodosContext = React.createContext();

const App = () => {
    const [todos, dispatch] = useReducer(reducer, initialState)
    return(
        <TodosContext.Provider
            value = { { todosState: todos, todosDispatch: dispatch }}
        >
            <Todo />
        </TodosContext.Provider>
    )
};

const container = document.getElementById('container');
const root = createRoot(container);
root.render(<App tab="home" />);