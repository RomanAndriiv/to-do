import { ADD_TASK } from "../actions";
import { DELETE_TASK } from "../actions";
import { TOGGLE_TASK } from "../actions";

export const initialState = {
    todos: [],
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TASK:
            return {
                ...state,
                todos: [...state.todos, {
                    id: action.id,
                    text: action.text,
                }],
            }
        case DELETE_TASK:
            return {
                ...state,
                todos: state.todos.filter(t => t.id !== action.id),
            }
        case TOGGLE_TASK:
            return {
                ...state,
                todos: state.todos.filter(t => {
                    if(t.id === action.id) {
                        let task = t
                        t.lineThrough = !t.lineThrough;
                        return task;
                    }
                    else return t;
                }),
            }
        default:
            return state;
    }
};
