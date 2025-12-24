import React, { useContext, useState } from "react";
import { deleteTask, toggleTask, moveTask, moveTaskTo } from "../actions";
import { TodosContext } from "../index";
import NoTasks from "../components/NoTasks";

export const TodoList = ({ column = "To Do", search = "" }) => {
  const todosContext = useContext(TodosContext);
  const columnsOrder = (todosContext &&
    todosContext.todosState &&
    todosContext.todosState.columnsOrder) || ["To Do", "In Progress", "Done"];
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const allTodos = todosContext.todosState.todos || [];
  const items = allTodos
    .filter((t) => (t.column || "To Do") === column)
    .filter((t) => {
      if (!search || !search.trim()) return true;
      return (t.text || "").toLowerCase().includes(search.toLowerCase());
    });
  const { selectedIds = [], setSelectedIds } = todosContext || {};
  const allSelectedInColumn =
    items.length > 0 && items.every((t) => selectedIds.includes(t.id));

  if (allTodos.length === 0) return <NoTasks entity={"items"} />;

  // always render the list as a drop target so tasks can be dropped into empty columns
  return (
    <ul
      className="theList"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const data =
          e.dataTransfer.getData("text/task") ||
          e.dataTransfer.getData("text/plain");
        if (!data) return;
        try {
          const parsed = JSON.parse(data);
          const toIndex = dragOverIndex !== null ? dragOverIndex : items.length;
          todosContext.todosDispatch(moveTaskTo(parsed.id, column, toIndex));
        } catch (err) {
          // ignore non-task payloads
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
            const data =
              e.dataTransfer.getData("text/task") ||
              e.dataTransfer.getData("text/plain");
            if (!data) return;
            try {
              const parsed = JSON.parse(data);
              todosContext.todosDispatch(moveTaskTo(parsed.id, column, 0));
            } catch (err) {
              // ignore non-task payloads
            }
            setDragOverIndex(null);
          }}
        >
          <NoTasks entity={column} />
        </li>
      ) : (
        <>
          <li className="selectAllControl">
            <label>
              <input
                type="checkbox"
                checked={allSelectedInColumn}
                onChange={(e) => {
                  e.stopPropagation();
                  if (allSelectedInColumn) {
                    // unselect all in this column
                    const next = selectedIds.filter(
                      (id) => !items.some((t) => t.id === id)
                    );
                    setSelectedIds(next);
                  } else {
                    // add all item ids in this column to selection
                    const idsToAdd = items
                      .map((t) => t.id)
                      .filter((id) => !selectedIds.includes(id));
                    setSelectedIds([...selectedIds, ...idsToAdd]);
                  }
                }}
              />
              Select all in this column
            </label>
          </li>
          {items.map((item, index) => {
            const idx = columnsOrder.indexOf(column);
            const canMoveLeft = idx > 0;
            const canMoveRight = idx < columnsOrder.length - 1;
            return (
              <li
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "text/task",
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
                key={item.id}
              >
                <div className="itemRow">
                  <div className="itemSelect">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const next = selectedIds.includes(item.id)
                          ? selectedIds.filter((id) => id !== item.id)
                          : [...selectedIds, item.id];
                        setSelectedIds(next);
                      }}
                    />
                  </div>
                  <div className="itemToggle">
                    <input
                      type="checkbox"
                      checked={!!item.lineThrough}
                      onChange={(e) => {
                        e.stopPropagation();
                        todosContext.todosDispatch(toggleTask(item.id));
                      }}
                    />
                  </div>
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
          })}
        </>
      )}
    </ul>
  );
};
