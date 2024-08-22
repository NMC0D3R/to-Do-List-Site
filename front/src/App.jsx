import React, { useEffect, useState } from "react";
import AddTaskForm from "./components/AddTaskForm";
import List from "./components/List";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPasswordForm from "./components/ResetPass";
import {
  useGetTasksByUserQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useClearAllTasksMutation,
  useHandleCompleteToggleMutation,
  useEditTaskMutation,
} from "./slices/taskApiSlice";
import LoginModal from "./components/ModalLogin";

function App() {
  const { data: tasksData, refetch } = useGetTasksByUserQuery();
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [clearAllTasks] = useClearAllTasksMutation();
  const [handleCompleteToggle] = useHandleCompleteToggleMutation();
  const [editTask] = useEditTaskMutation();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  // Add task handler
  const addTask = async (newTask) => {
    try {
      const result = await createTask(newTask).unwrap();
      console.log(result);
      refetch();
      const sortedTasks = [...result.user.tasks].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
      setTasks(sortedTasks);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Clear all tasks handler
  const handleClearAllTasks = async () => {
    try {
      const result = await clearAllTasks().unwrap();
      if (result.status === "success") {
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to clear tasks:", error);
    }
  };

  // Fetch tasks when user is set
  useEffect(() => {
    if (user) {
      refetch().then(({ data }) => setTasks(data.tasks));
    }
  }, [user, refetch]);

  // Filter tasks based on state
  const filterTasks = () => {
    let filteredTasks = tasks;
    if (!showCompleted) {
      filteredTasks = filteredTasks.filter((task) => !task.taskIsCompleted);
    }
    if (showUrgentOnly) {
      filteredTasks = filteredTasks.filter(
        (task) => task.taskPriority === "red"
      );
    }

    return filteredTasks;
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <LoginModal setUser={setUser} setTasks={setTasks} />
                <AddTaskForm addTask={addTask} />
                <div className="controls">
                  <button onClick={() => setShowCompleted((prev) => !prev)}>
                    {showCompleted ? "Hide Completed" : "Show Completed"}
                  </button>
                  <button onClick={() => setShowUrgentOnly((prev) => !prev)}>
                    {showUrgentOnly ? "Show All" : "Show Urgent Only"}
                  </button>
                  <button onClick={handleClearAllTasks}>
                    Delete All Tasks
                  </button>
                </div>
                <List
                  handleCompleteToggle={handleCompleteToggle}
                  tasks={filterTasks()}
                  deleteTask={deleteTask}
                  editTask={editTask}
                />
              </>
            }
          />
          <Route path="/ForgetPassword" element={<ResetPasswordForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
