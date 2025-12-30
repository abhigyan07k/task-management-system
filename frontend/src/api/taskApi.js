import API from "./api";

// Get task pagination--------------------->
export const getTasks = (page, limit) =>
  API.get(`/tasks?page=${page}&limit=${limit}`);

// Create task------------------->
export const createTask = (data) => {
  return API.post("/tasks", data);
};

// Update task-------------------->
export const updateTask = (id, data) => {
  return API.put(`/tasks/${id}`, data);
};

// Delete task--------------------->
export const deleteTask = (id) => {
  return API.delete(`/tasks/${id}`);
};

// Get single task----------------->
export const getTaskById = (id) => {
  return API.get(`/tasks/${id}`);
};
