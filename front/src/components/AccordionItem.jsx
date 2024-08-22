import React, { useState } from "react";
import {
  useDeleteTaskMutation,
  useEditTaskMutation,
} from "../slices/taskApiSlice";

const AccordionItem = ({ task, handleCompleteToggle, refetch }) => {
  const [editTask] = useEditTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.taskTitle);
  const [editedDescription, setEditedDescription] = useState(
    task.taskDescription
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const id = task._id;
    editTask(id, editedTitle, editedDescription).then(() => {
      setIsEditing(false);
    });
  };

  const handleDeleteWithConfirmation = async (taskId) => {
    try {
      await deleteTask(taskId);
      refetch();
    } catch (err) {
      console.log(err);
    }
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
  };

  return (
    <div className="accordion-item">
      <div
        className={`accordion-header ${task.isCompleted ? "completed" : ""}`}
        onClick={handleToggle}
      >
        <div className="accordion-header-content">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            <span className="task-name">{task.taskTitle}</span>
          )}
          <span className="task-date">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        <span className={`priority-dot ${task.taskPriority}`}></span>
      </div>
      {isOpen && (
        <div className="accordion-body">
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          ) : (
            <p>{task.taskDescription}</p>
          )}
          <div className="task-actions">
            {isEditing ? (
              <>
                <button onClick={handleSaveClick}>Save Task</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleEditClick}>Edit Task</button>
                <button onClick={() => handleCompleteToggle(task._id)}>
                  {task.taskIsCompleted
                    ? "Mark as Incomplete"
                    : "Mark as Complete"}
                </button>
                <button onClick={() => handleDeleteWithConfirmation(task._id)}>
                  Delete Task
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
