import { Component } from "react";

class overdue extends React.Component {
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
    return (
      <>
        <h2>Overdue</h2>
        <div id="list-wrapper">
          {tasks
            .slice(0)
            .reverse()
            .map(function (task, index) {
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
                          {new Date(task.creation_date).toDateString()}
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
      </>
    );
  }
}
export default overdue;
