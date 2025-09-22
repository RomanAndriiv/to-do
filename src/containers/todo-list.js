import React, { useContext } from "react";
import { deleteTask, toggleTask } from "../actions";
import { TodosContext } from "../index";
import Expanation from "../components/Expanation";
import NoTasks from "../components/NoTasks";
import NoTasks2 from "../components/NoTasks2";

export const TodoList = () => {
  const todosContext = useContext(TodosContext);

  if (todosContext.todosState.todos.length === 0)
    return (
      <>
        <NoTasks entity={"items"} />
        <NoTasks2 />
        <Expanation />
      </>
    );
  else
    return (
      <ul className="theList">
        {todosContext.todosState.todos.map((item) => {
          return (
            <li
              className={`${item.lineThrough ? "lineThrough" : ""}`}
              onClick={() => todosContext.todosDispatch(toggleTask(item.id))}
              key={item.id}
            >
              {item.text}
              <span
                onClick={() => todosContext.todosDispatch(deleteTask(item.id))}
              >
                X
              </span>
            </li>
          );
        })}
      </ul>
    );
};
