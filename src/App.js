import "./App.css";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineModeEditOutline } from "react-icons/md";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myStyle: {
        color: "black",
        backgroundColor: "white",
      },
      todolist: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
        creation_date: "",
        update_date: "",
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleNameUpdate = this.handleNameUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.strikeUnstrike = this.strikeUnstrike.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("Fetching");

    fetch("http://127.0.0.1:8000/api/task-list")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todolist: data,
        })
      );
      // hi
  }

  handleNameUpdate(e) {
    var value = e.target.value;

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("Item", this.state.activeItem);
    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-create";

    if (this.state.editing === true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
            creation_date: "",
            update_date: "",
          },
        });
      })
      .catch(function (error) {
        console.log("Error", error);
      });
  }

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    var csrftoken = this.getCookie("csrftoken");
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  }

  strikeUnstrike(task) {
    task.completed = !task.completed;
    var csrftoken = this.getCookie("csrftoken");
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then((response) => {
      this.fetchTasks();
    });
    console.log("Task", task.completed);
  }

  toggleTheme(myStyle) {
    if (myStyle.color === "black") {
      this.setState({
        myStyle: {
          color: "white",
          backgroundColor: "black",
        },
      });
    } else {
      this.setState({
        myStyle: {
          color: "black",
          backgroundColor: "white",
        },
      });
    }
    console.log("THEME", myStyle);
  }

  render() {
    var tasks = this.state.todolist;
    var self = this;
    var today = new Date();
    var today_list = []
    var date =today.getFullYear() +"-" +(today.getMonth() + 1) + "-" +today.getDate();

    tasks.map(function (task, index){
      return(
        new Date(date).toDateString() === new Date(task.creation_date).toDateString() &&
          today_list.push(task)
      )}
      );
    console.log('Today List', today_list)

    return (
      <>
        <div className="body" style={this.state.myStyle}>
          <div className="container" style={this.state.myStyle}>
            <div className="form-check form-switch">
              <input
                onClick={() => self.toggleTheme(this.state.myStyle)}
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              ></label>
            </div>
            <p>Change Theme</p>
          </div>
          <div className="container" style={this.state.myStyle}>
            <div className="task-container" style={this.state.myStyle}>
              <div id="form-wrapper my-3" style={this.state.myStyle}>
                <form onSubmit={this.handleSubmit} id="form">
                  <div className="flex-wrapper my-3">
                    <div style={{ flex: 6 }}>
                      <input
                        onChange={this.handleNameUpdate}
                        className="form-control"
                        id="title"
                        value={this.state.activeItem.title}
                        name="title"
                        type="text"
                        placeholder="Add Task"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        id="submit"
                        className="btn btn-warning"
                        name="Add"
                        type="submit"
                      />
                    </div>
                  </div>
                </form>
              </div>



              <h2>Today</h2>
              <span style={{color: 'red'}}><b>{new Date(date).toDateString()}</b></span>
              <div id="list-wrapper">
                {today_list.slice(0).reverse().map(function (task, index) {
                    return (
                      <div key={index} className="task-wrapper flex-wrapper">
                        <div onClick={() => self.strikeUnstrike(task)} style={{ flex: 5 }}>
                          {task.completed === false ? (
                            <>
                              {new Date(date).toDateString() === new Date(task.creation_date).toDateString()&& (
                                <>
                                  <h5>{task.title} </h5>
                                  <span style={{ color: "red" }}>
                                    {new Date(task.creation_date).toLocaleString(undefined, { day: "numeric", month: "short"})}
                                  </span>
                                </>
                              ) }
                            </>
                          ) : (
                            <strike>{task.title}</strike>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <button
                            onClick={() => self.startEdit(task)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <MdOutlineModeEditOutline color="#0DCAF0" />
                          </button>
                        </div>
                        <div style={{ flex: 1 }}>
                          <button
                            onClick={() => self.deleteItem(task)}
                            className="btn btn-sm btn-outline-danger delete"
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <h2>Overdue</h2>
              <div id="list-wrapper">
                {tasks.slice(0).reverse().map(function (task, index) {
                    return (
                      <div key={index} className="task-wrapper flex-wrapper">
                        <div
                          onClick={() => self.strikeUnstrike(task)}
                          style={{ flex: 5 }}
                        >
                          {task.completed === false ? (
                            <>
                              <h5>{task.title} </h5>
                              <span style={{ color: "red" }}>
                                {new Date(task.creation_date).toLocaleString(undefined, { day: "numeric", month: "short"})}
                              </span>
                            </>
                          ) : (
                            <strike>{task.title}</strike>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <button
                            onClick={() => self.startEdit(task)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <MdOutlineModeEditOutline color="#0DCAF0" />
                          </button>
                        </div>
                        <div style={{ flex: 1 }}>
                          <button
                            onClick={() => self.deleteItem(task)}
                            className="btn btn-sm btn-outline-danger delete"
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default App;
