import { ADD_TASK_ASYNC } from "../actions";
import { DELETE_TASK } from "../actions";

const initialState = {
    tasks: [],
};

const todos = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TASK_ASYNC:
            return {
                ...state,
                tasks: [...state.tasks, {
                    id: action.id,
                    text: action.text,
                }],
            }
        case DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter(t => t.id !== action.id),
            }
        default:
            return state;
    }
};

export default todos;