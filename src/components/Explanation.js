import React, { Component } from "react";
import NoTasks2 from "../components/NoTasks2";

class Explanation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "This is a simple to-do application built with React. You can add tasks, mark them as completed, and delete them.",
    };
  }

  changeText = () => {
    this.setState({ text: "This is changed text" });
  };

  render() {
    return (
      <div>
        <p>{this.state.text}</p>
        <NoTasks2 changeText={this.changeText} />
      </div>
    );
  }
}

export default Explanation;
