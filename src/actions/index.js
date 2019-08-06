export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const TOGGLE_TASK = 'TOGGLE_TASK';

let nextId = 0;
export const addTask = (text) => {
    return {
        lineThrough: false,
        id: nextId++,
        text,
        type: ADD_TASK
    }
}
export function deleteTask(id) {
    return {
        id,
        type: DELETE_TASK,
    }
}
export function toggleTask(id) {
    return {
        id,
        type: TOGGLE_TASK,
    }
}