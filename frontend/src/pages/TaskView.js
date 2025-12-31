import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./TaskView.css"

const TaskView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        console.error("Fetch task error:", error);
      }
    };

    fetchTask();
  }, [id]);

  if (!task) return <div className="taskview-container">Loading...</div>;

return (
  <div className="taskview-container">
    <div className="taskview-card">
      <h2>{task.title}</h2>

      <p>
        <strong>Description:</strong> {task.description}
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        <span className={`taskview-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span className={`taskview-badge status-${task.status}`}>
          {task.status}
        </span>
      </p>

      <p>
        <strong>Due Date:</strong>{" "}
        {new Date(task.dueDate).toLocaleDateString()}
      </p>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  </div>
);

};

export default TaskView;
