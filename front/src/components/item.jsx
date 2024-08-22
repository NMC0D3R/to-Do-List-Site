import React from "react";

function Item({ task, deleteTask, toggleCompletion }) {
  return (
    <div
      className={`task-item ${task.priority} ${
        task.isCompleted ? "completed" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => toggleCompletion(task.id)}
      />
      <h3>{task.title}</h3>
      <p>{task.body}</p>
      <p>Due: {task.dueDate}</p>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  );
}

export default Item;
