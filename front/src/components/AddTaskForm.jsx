import React, { useState } from "react";
import "./AddTaskForm.css";

function AddTaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("green");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      taskId: Date.now(),
      taskTitle: title,
      taskDescription: body,
      dueDate,
      taskPriority,
      taskIsCompleted: false,
    };

    addTask(newTask); // Call the addTask function passed as prop

    setTitle("");
    setBody("");
    setDueDate("");
    setTaskPriority("green");
  };

  return (
    <>
      <h1 className="todolist-app">To Do List app</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Task Description"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="red">Very Urgent</option>
          <option value="yellow">Moderately Urgent</option>
          <option value="green">Not Urgent</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
    </>
  );
}

export default AddTaskForm;
