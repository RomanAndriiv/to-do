import React, { useContext, useState } from "react";
import {
  deleteTask,
  toggleTask,
  moveTask,
  moveTaskTo,
  updateTask,
} from "../actions";
import { TodosContext } from "../index";
import NoTasks from "../components/NoTasks";

export const TodoList = ({
  column = "To Do",
  search = "",
  statusFilter = "all",
}) => {
  const todosContext = useContext(TodosContext);
  const columnsOrder = (todosContext &&
    todosContext.todosState &&
    todosContext.todosState.columnsOrder) || ["To Do", "In Progress", "Done"];
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const subsequenceIndices = (q, text) => {
    if (!q) return null;
    const indices = [];
    let j = 0;
    for (let i = 0; i < text.length && j < q.length; i++) {
      if (text[i] === q[j]) {
        indices.push(i);
        j++;
      }
    }
    return indices.length === q.length ? indices : null;
  };

  const levenshtein = (a, b) => {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  };

  const findMatchInfo = (text = "", rawQ = "") => {
    const q = (rawQ || "").trim().toLowerCase();
    if (!q) return null;
    const lower = text.toLowerCase();
    // direct substring
    const idx = lower.indexOf(q);
    if (idx !== -1) return { type: "substring", index: idx, length: q.length };
    // subsequence (characters in order)
    const seq = subsequenceIndices(q, lower);
    if (seq) return { type: "chars", indices: seq };
    // Levenshtein: try matching against substrings of similar length
    const allowed = Math.max(1, Math.floor(q.length * 0.34));
    let best = { dist: Infinity, index: -1, len: 0 };
    for (let len = Math.max(1, q.length - 1); len <= q.length + 1; len++) {
      if (len > lower.length) continue;
      for (let i = 0; i <= lower.length - len; i++) {
        const sub = lower.substring(i, i + len);
        const d = levenshtein(q, sub);
        if (d < best.dist) best = { dist: d, index: i, len };
      }
    }
    if (best.dist <= allowed)
      return { type: "substring", index: best.index, length: best.len };
    return null;
  };

  const allTodos = todosContext.todosState.todos || [];
  const items = allTodos
    .filter((t) => (t.column || "To Do") === column)
    .filter((t) => {
      if (!search || !search.trim()) return true;
      return !!findMatchInfo(t.text, search);
    })
    .filter((t) => {
      if (!statusFilter || statusFilter === "all") return true;
      const completed = !!t.lineThrough;
      if (statusFilter === "complete") return completed;
      if (statusFilter === "incomplete") return !completed;
      return true;
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
            const q = (search || "").trim();
            const text = item.text || "";
            const matchInfo = findMatchInfo(text, q);
            const idx = columnsOrder.indexOf(column);
            const canMoveLeft = idx > 0;
            const canMoveRight = idx < columnsOrder.length - 1;
            const isEditing = editingId === item.id;
            return (
              <li
                draggable={!isEditing}
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
                  <div className="itemText">
                    {isEditing ? (
                      <input
                        className="itemEditInput"
                        value={editText}
                        title="Press Enter to save, Esc to cancel"
                        aria-label="Edit task text; press Enter to save, Esc to cancel"
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            todosContext.todosDispatch(
                              updateTask(item.id, editText)
                            );
                            setEditingId(null);
                            setEditText("");
                          } else if (e.key === "Escape") {
                            e.stopPropagation();
                            setEditingId(null);
                            setEditText("");
                          }
                        }}
                        autoFocus
                      />
                    ) : matchInfo ? (
                      matchInfo.type === "substring" ? (
                        <>
                          {text.substring(0, matchInfo.index)}
                          <span className="highlight">
                            {text.substring(
                              matchInfo.index,
                              matchInfo.index + matchInfo.length
                            )}
                          </span>
                          {text.substring(matchInfo.index + matchInfo.length)}
                        </>
                      ) : matchInfo.type === "chars" ? (
                        <>
                          {text.split("").map((ch, i) =>
                            matchInfo.indices.includes(i) ? (
                              <span className="highlight" key={i}>
                                {ch}
                              </span>
                            ) : (
                              <React.Fragment key={i}>{ch}</React.Fragment>
                            )
                          )}
                        </>
                      ) : (
                        item.text
                      )
                    ) : (
                      item.text
                    )}
                  </div>
                  <div className="itemControls">
                    {!isEditing && (
                      <>
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
                          title="Edit task (Enter=save, Esc=cancel)"
                          aria-label={`Edit task ${item.text}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(item.id);
                            setEditText(item.text || "");
                          }}
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            todosContext.todosDispatch(deleteTask(item.id));
                          }}
                        >
                          X
                        </button>
                      </>
                    )}
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
