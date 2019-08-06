import React, { useContext } from "react";
import { deleteTask, toggleTask } from "../actions";
import { TodosContext } from "../index"

export const TodoList = () => {
    const todosContext = useContext(TodosContext);

    if (todosContext.todosState.todos.length === 0)  return <div>Trere are no tasks</div>;
    else return (
        <ul className="theList">
            {todosContext.todosState.todos.map(item => {
                return <li
                            className={`${item.lineThrough ? 'lineThrough' : ''}`}
                            onClick={() => todosContext.todosDispatch(toggleTask(item.id))}
                            key={item.id}>{item.text}
                            <span onClick={() => todosContext.todosDispatch(deleteTask(item.id))}>X</span>
                        </li>
            })}
        </ul>);
}
