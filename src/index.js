import React, { useReducer } from "react";
import ReactDOM from "react-dom";
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

ReactDOM.render( <App />, document.querySelector("#container"));