import React, { useContext, useRef } from "react";
import { addTask } from "../actions";
import { TodosContext } from "../index"

export const AddTask = () => {
    const inputEl = useRef(null);
    const todosContext = useContext(TodosContext);

    const addTodo = (e) => {
        e.preventDefault();

        if (inputEl.current.trim !== "") {
            todosContext.todosDispatch(addTask(inputEl.current.value));
            inputEl.current.value = "";
        }
    }

    return (   
        <div className="header">
            <form onSubmit={addTodo}>
                <input ref={inputEl}
                        placeholder="enter task">
                </input>
                <button type="submit">add</button>
            </form>
        </div>
    );
}
