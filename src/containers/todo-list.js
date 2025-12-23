import React, { useContext, useState } from "react";
import { deleteTask, toggleTask, moveTask, moveTaskTo } from "../actions";
import { TodosContext } from "../index";
import Explanation from "../components/Explanation";
import NoTasks from "../components/NoTasks";

const columnsOrder = ["To Do", "In Progress", "Done"];

export const TodoList = ({ column = "To Do" }) => {
  const todosContext = useContext(TodosContext);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const allTodos = todosContext.todosState.todos || [];
  const items = allTodos.filter((t) => (t.column || "To Do") === column);

  if (allTodos.length === 0)
    return (
      <>
        <NoTasks entity={"items"} />
        <Explanation />
      </>
    );

  // always render the list as a drop target so tasks can be dropped into empty columns
  return (
    <ul
      className="theList"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        if (!data) return;
        try {
          const parsed = JSON.parse(data);
          const toIndex = dragOverIndex !== null ? dragOverIndex : items.length;
          todosContext.todosDispatch(moveTaskTo(parsed.id, column, toIndex));
        } catch (err) {
          // ignore
        }
        setDragOverIndex(null);
      }}
    >
      {items.length === 0 ? (
        <li
          className="emptyPlaceholder"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverIndex(0);
          }}
          onDrop={(e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text/plain");
            if (!data) return;
            try {
              const parsed = JSON.parse(data);
              todosContext.todosDispatch(moveTaskTo(parsed.id, column, 0));
            } catch (err) {
              // ignore
            }
            setDragOverIndex(null);
          }}
        >
          <NoTasks entity={column} />
        </li>
      ) : (
        items.map((item, index) => {
          const idx = columnsOrder.indexOf(column);
          const canMoveLeft = idx > 0;
          const canMoveRight = idx < columnsOrder.length - 1;
          return (
            <li
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "text/plain",
                  JSON.stringify({
                    id: item.id,
                    fromColumn: column,
                    fromIndex: index,
                  })
                );
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDragEnd={() => setDragOverIndex(null)}
              className={`${item.lineThrough ? "lineThrough" : ""}`}
              onClick={() => todosContext.todosDispatch(toggleTask(item.id))}
              key={item.id}
            >
              <div className="itemRow">
                <div className="itemText">{item.text}</div>
                <div className="itemControls">
                  {canMoveLeft && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        todosContext.todosDispatch(
                          moveTask(item.id, columnsOrder[idx - 1])
                        );
                      }}
                    >
                      ◀
                    </button>
                  )}
                  {canMoveRight && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        todosContext.todosDispatch(
                          moveTask(item.id, columnsOrder[idx + 1])
                        );
                      }}
                    >
                      ▶
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      todosContext.todosDispatch(deleteTask(item.id));
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};
