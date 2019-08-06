import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import "./index.css";
import Todo from "./components/todo";
import store from "./store";

const App = () => (
    <div>
        <Provider store={store}>
            <Todo />
        </Provider>
    </div>
);

ReactDOM.render( <App />, document.querySelector("#container"));