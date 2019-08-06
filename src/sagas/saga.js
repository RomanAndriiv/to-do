import { ADD_TASK } from "../actions";
import { ADD_TASK_ASYNC } from "../actions";
import { delay, takeLatest, put } from 'redux-saga/effects';

function* addTaskAsync(action) {
    yield delay(2000);
    yield put({type: ADD_TASK_ASYNC, id: action.id, text: action.text});
}

export function* watchTaskAdd() {
    yield takeLatest(ADD_TASK, addTaskAsync)
}