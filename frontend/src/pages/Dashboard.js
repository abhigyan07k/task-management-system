import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";

const priorities = ["high", "medium", "low"];
const statusOptions = ["pending", "in-progress", "completed"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [pages, setPages] = useState(1);

  const fetchTasks = async () => {
    const { data } = await api.get(`/api/tasks?page=${page}&limit=${limit}`);
    setTasks(data.tasks);
    setPages(data.pages);
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  // Logout------------------->
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Delete task--------------------->
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    await api.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // Status change-------------------->
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}`, {
        status: newStatus,
      });
      fetchTasks(page);
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
    }
  };
  // Drag & drop function--------------->
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (priority) => {
    if (!draggedTask || draggedTask.priority === priority) return;

    await api.put(`/api/tasks/${draggedTask._id}`, { priority });

    setTasks((prev) =>
      prev.map((t) => (t._id === draggedTask._id ? { ...t, priority } : t))
    );

    setDraggedTask(null);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Task Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <TaskForm
        editTask={editTask}
        onTaskAdded={fetchTasks}
        onTaskUpdated={() => {
          fetchTasks();
          setEditTask(null);
        }}
      />

      {/* Priority Columns */}
      <div className="priority-wrapper">
        {priorities.map((priority) => (
          <div
            key={priority}
            className="priority-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(priority)}
          >
            <h3 className="priority-title">{priority.toUpperCase()}</h3>

            {tasks
              .filter((task) => task.priority === priority)
              .map((task) => (
                <div
                  key={task._id}
                  className="task-card"
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <h4>{task.title}</h4>

                  <p>
                    {task.dueDate
                      ? new Date(task.dueDate).toDateString()
                      : "Invalid Date"}
                  </p>

                  {/* Status dropdown */}
                  <p>Task Status</p>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* Action button */}
                  <div className="task-actions">
                    <button onClick={() => navigate(`/tasks/${task._id}`)}>
                      View
                    </button>
                    <button onClick={() => setEditTask(task)}>Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          {page} / {pages}
        </span>
        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
