const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET not set! Using fallback secret for debugging.");
  process.env.JWT_SECRET = "fallback_super_secret_key";
}
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

const app = express();
app.use(express.urlencoded({ extended: true }));



app.use(cors({
  origin: "https://taskmanagementsystemindia.netlify.app",
  credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Managemnt System is Live...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected!"))
  .catch((e) => console.error(e));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 
});
