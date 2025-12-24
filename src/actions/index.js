export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const TOGGLE_TASK = "TOGGLE_TASK";
export const MOVE_TASK = "MOVE_TASK";
export const MOVE_TASK_TO = "MOVE_TASK_TO";
export const MOVE_COLUMN = "MOVE_COLUMN";

let nextId = 0;
if (typeof window !== "undefined" && window.localStorage) {
  try {
    const stored = parseInt(localStorage.getItem("nextId"), 10);
    if (!Number.isNaN(stored)) nextId = stored;
  } catch (err) {}
}
export const addTask = (text, column = "To Do") => {
  const id = nextId++;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem("nextId", String(nextId));
    } catch (err) {}
  }
  return {
    lineThrough: false,
    id,
    text,
    column,
    type: ADD_TASK,
  };
};
export function moveTask(id, column) {
  return {
    id,
    column,
    type: MOVE_TASK,
  };
}
export function moveTaskTo(id, column, toIndex) {
  return {
    id,
    column,
    toIndex,
    type: MOVE_TASK_TO,
  };
}
export function moveColumn(fromIndex, toIndex) {
  return {
    fromIndex,
    toIndex,
    type: MOVE_COLUMN,
  };
}
export const ADD_COLUMN = "ADD_COLUMN";
export const DELETE_COLUMN = "DELETE_COLUMN";

export function addColumn(name) {
  return {
    name,
    type: ADD_COLUMN,
  };
}

export function deleteColumn(index) {
  return {
    index,
    type: DELETE_COLUMN,
  };
}
export function deleteTask(id) {
  return {
    id,
    type: DELETE_TASK,
  };
}
export function toggleTask(id) {
  return {
    id,
    type: TOGGLE_TASK,
  };
}
