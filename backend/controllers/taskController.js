const Task = require("../models/Task");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title & Due Date required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET (Pagination)
exports.getTasks = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const total = await Task.countDocuments({ user: req.user._id });

  const tasks = await Task.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    tasks,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};

// GET BY ID
exports.getTaskById = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
};

// UPDATE (SAFE UPDATE)
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        $set: req.body, // only update sent fields
      },
      {
        new: true,
        runValidators: false, // 🔥 VERY IMPORTANT
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
};
