import React, { useState } from "react";
import axios from "axios";
import "./Task-manager.css";




const Task = () => {
    let[taskList, setTaskList]= useState([]);
    
    let [taskData, setTaskData] = useState({
      title: "",
      description: "",
      status: "",
    });
    
    const InputEvent = (event) => {
      const { name, value } = event.target;
      setTaskData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
    
    
    const showTask=()=>{
    const serverUrl = "http://localhost:8070/tasks";
    axios
    .get(serverUrl)
    .then((response) => {
      console.log(response.data);
      setTaskList(response.data);
    })
    .catch((error) => {
      console.error("Error receiving data:", error);
    });
    }
    const deleteTask = async () => {
    try {
      const taskName = prompt("Enter the title of the task you want to delete");
      const serverUrl = `http://localhost:8070/tasks/${encodeURIComponent(taskName)}`;
      console.log(serverUrl);
      const response = await axios.delete(serverUrl);
      const result = response.data;
      alert("Deleted Successfully");
      console.log(result);
      
    } catch (error) {
      alert(error)
      console.error("Error deleting task:", error);
      
    }
    }; 
    
    const updateTask = async()=>{
    
    try {
      const taskName = prompt("Enter the title of the task you want to delete");
      const serverUrl = `http://localhost:8070/tasks/${encodeURIComponent(taskName)}`;
      console.log(serverUrl);
      const response = await axios.patch(serverUrl);
      const result = response.data;
      console.log(result);
      
    } catch (error) {
      alert(error);
      console.error("Error deleting form:", error);
    }
    
    }
    
    
    const onSubmitFun = (event) => {
      
      event.preventDefault();
      
      const serverUrl = "http://localhost:8070/tasks";
      console.log(taskData.title);
    
      axios
        .post(serverUrl, taskData)
        .then((response) => {
         
          console.log(response.data);
          alert("Task Added Successfully!");
        })
        .catch((error) => {
          alert(error);
          console.error("Error adding the task form:", error);
        });
    };
    
    return (
      <React.Fragment>
      <div className="container">
        <form className="form" onSubmit={onSubmitFun}>
          <h1>
            Task Management System
          </h1>
          <label htmlFor="name">
            Title
            <input
              type="text"
              name="title"
              placeholder="Enter the title of the task"
              onChange={InputEvent}
              value={taskData.title}
            />
          </label>
          <label>
            Description
            <input
              type="text"
              name="description"
              placeholder="Enter the description of the task"
              onChange={InputEvent}
              value={taskData.description}
            />
          </label>
          <label>
            Status
            <input
              type="text"
              name="status"
              placeholder="Enter the status"
              onChange={InputEvent}
              value={taskData.status}
            />
          </label>
          <button className="button">Submit</button>
        </form>
        <div className="button-container">
        <button className="button" onClick={showTask}>Show all tasks</button>
        <button className="button" onClick={deleteTask}>Delete task</button>
        <button className="button" onClick={updateTask}>Update task</button>
      </div>
      </div>
      <div className="task-list" >
      <h1  style={{textAlign: "center"}}>
      List of all the tasks
      </h1>
    {taskList.map((task, index) => (
        <div className="task-item" key={index}>
          <p>Title: {task.title}</p>
          <p>Description: {task.description}</p>
          <p >  Status:{task.status}</p>
        </div>
        ))}
    
    </div>
      </React.Fragment>
    );
    };
    
    export default Task;