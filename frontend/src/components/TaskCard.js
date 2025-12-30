import { updateTask } from "../api/taskApi";

const TaskCard = ({ task, fetchTasks, page, setEditTask, navigate }) => {
  const handleDrop = async (e, newPriority) => {
    e.preventDefault();

    await updateTask(task._id, {
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      priority: newPriority,
    });

    fetchTasks(page);
  };

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}
      className="task-card"
    >
      <h4>{task.title}</h4>
      <p>{new Date(task.dueDate).toDateString()}</p>
      <p>Status: {task.status}</p>

      <button onClick={() => navigate(`/tasks/${task._id}`)}>View</button>
      <button onClick={() => setEditTask(task)}>Edit</button>

      <div className="drop-zones">
        {["high", "medium", "low"].map((p) => (
          <div
            key={p}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, p)}
          >
            Move to {p}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
