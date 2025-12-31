import { useEffect, useState } from "react";
import API from "../api/api";
import "./TaskForm.css"

const TaskForm = ({ editTask, onTaskAdded, onTaskUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setPriority(editTask.priority || "medium");
      setStatus(editTask.status || "pending");
      setDueDate(
        editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().substring(0, 10)
          : ""
      );
    }
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, priority, status, dueDate };

    try {
      if (editTask) {
        const res = await API.put(`/tasks/${editTask._id}`, taskData);
        onTaskUpdated(res.data); // Dashboard update
      } else {
        const res = await API.post("/tasks", taskData);
        onTaskAdded(res.data); // Dashboard update
      }

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate("");
    } catch (error) {
      console.error("TASK SUBMIT ERROR:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      <button type="submit">{editTask ? "Update Task" : "Add Task"}</button>
    </form>
  );
};

export default TaskForm;
