import { ADD_TASK } from "../actions";
import { DELETE_TASK } from "../actions";
import { TOGGLE_TASK } from "../actions";
import { MOVE_TASK } from "../actions";
import { MOVE_TASK_TO } from "../actions";

export const initialState = {
  todos: [],
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
      const columnsOrder = ["To Do", "In Progress", "Done"];

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
    default:
      return state;
  }
};
