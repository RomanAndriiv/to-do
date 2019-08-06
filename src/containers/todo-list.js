import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { deleteTask } from "../actions";


class TodoList extends Component {
    deleteTask = (item) => {
        return <li onClick={() => this.props.deleteTask(item.id)}
                    key={item.id}>{item.text}</li>
    }

    render() {
        if (this.props.tasks.length === 0) {
            return <div>Trere are no tasks</div>;
        }

        return (
            <ul className="theList">
                {this.props.tasks.map(this.deleteTask)}
            </ul>
        );
    }
}
TodoList.propTypes = {
    tasks: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
    return {
        tasks: state.todos.tasks,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        deleteTask: (id) => dispatch(deleteTask(id))
    }
}

const TodoListConnnected = connect(mapStateToProps, mapDispatchToProps)(TodoList);
export default TodoListConnnected;