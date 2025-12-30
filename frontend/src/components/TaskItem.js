const TaskItem = ({ task, onDelete }) => {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>
        Status: {task.status} | Priority: {task.priority}
      </p>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
