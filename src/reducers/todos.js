import { ADD_TASK } from "../actions";
import { DELETE_TASK } from "../actions";
import { TOGGLE_TASK } from "../actions";
import { MOVE_TASK } from "../actions";
import { MOVE_TASK_TO } from "../actions";
import { MOVE_COLUMN } from "../actions";
import { ADD_COLUMN, DELETE_COLUMN } from "../actions";

export const initialState = {
  todos: [],
  columnsOrder: ["To Do", "In Progress", "Done"],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: action.id,
            text: action.text,
            lineThrough: action.lineThrough || false,
            column: action.column || "To Do",
          },
        ],
      };
    case DELETE_TASK:
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.id),
      };
    case TOGGLE_TASK:
      return {
        ...state,
        todos: state.todos.map((t) => {
          if (t.id === action.id) {
            return { ...t, lineThrough: !t.lineThrough };
          }
          return t;
        }),
      };
    case MOVE_TASK:
      return {
        ...state,
        todos: state.todos.map((t) => {
          if (t.id === action.id) {
            return { ...t, column: action.column };
          }
          return t;
        }),
      };
    case MOVE_TASK_TO: {
      const { id, column: toColumn, toIndex } = action;
      const columnsOrder = state.columnsOrder || [
        "To Do",
        "In Progress",
        "Done",
      ];

      // find the task to move
      const task = state.todos.find((t) => t.id === id);
      if (!task) return state;

      // remove the task
      const remaining = state.todos.filter((t) => t.id !== id);

      // count tasks before the target column
      const beforeCount = columnsOrder.reduce((acc, col) => {
        if (col === toColumn) return acc;
        return (
          acc + remaining.filter((t) => (t.column || "To Do") === col).length
        );
      }, 0);

      const insertAt = Math.max(
        0,
        Math.min(remaining.length, beforeCount + (toIndex || 0))
      );

      const moved = { ...task, column: toColumn };

      const newTodos = [
        ...remaining.slice(0, insertAt),
        moved,
        ...remaining.slice(insertAt),
      ];

      return {
        ...state,
        todos: newTodos,
      };
    }
    case MOVE_COLUMN: {
      const { fromIndex, toIndex } = action;
      const current = state.columnsOrder || ["To Do", "In Progress", "Done"];
      if (fromIndex == null || toIndex == null) return state;
      if (fromIndex === toIndex) return state;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return {
        ...state,
        columnsOrder: next,
      };
    }
    case ADD_COLUMN: {
      const { name } = action;
      if (!name || typeof name !== "string") return state;
      const current = state.columnsOrder || ["To Do", "In Progress", "Done"];
      // avoid duplicates
      if (current.includes(name)) return state;
      return {
        ...state,
        columnsOrder: [...current, name],
      };
    }
    case DELETE_COLUMN: {
      const { index } = action;
      const current = state.columnsOrder || ["To Do", "In Progress", "Done"];
      if (index == null || index < 0 || index >= current.length) return state;
      const removed = current[index];
      // choose target column for tasks: prefer left, else right, else first
      const target = current[index - 1] ?? current[index + 1] ?? current[0];
      const newColumns = [
        ...current.slice(0, index),
        ...current.slice(index + 1),
      ];
      const newTodos = state.todos.map((t) => {
        if ((t.column || "To Do") === removed) {
          return { ...t, column: target };
        }
        return t;
      });
      return {
        ...state,
        columnsOrder: newColumns,
        todos: newTodos,
      };
    }
    default:
      return state;
  }
};
