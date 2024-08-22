import "./List.css";
import AccordionItem from "./AccordionItem";
import { useGetTasksByUserQuery } from "../slices/taskApiSlice";

function List({
  // tasks,
  toggleCompletion,
  deleteTask,
  editTask,
  getTasksByUser,
  handleCompleteToggle,
}) {
  const { data, isLoading, refetch, error } = useGetTasksByUserQuery();
  const tasks = data?.tasks;

  return (
    <div className="task-list">
      {!!tasks &&
        tasks
          .filter((task) => task) // Filter out undefined or null tasks
          .map((task) => (
            <AccordionItem
              refetch={refetch}
              handleCompleteToggle={handleCompleteToggle}
              getTasksByUser={getTasksByUser}
              key={task._id} // Ensure _id exists
              task={task}
              toggleCompletion={toggleCompletion}
              deleteTask={deleteTask}
              editTask={editTask} // Pass the editTask function
            />
          ))}
    </div>
  );
}

export default List;
