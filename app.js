// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require('cors')

// Create Express app
const app = express();

// Configure Express to use JSON data
app.use(express.json());

// Configure morgan to log requests
app.use(morgan('dev'));

// Use cors middleware to handle CORS errors
app.use(cors());


// Connect to MongoDB
mongoose
  .connect("mongodb+srv://chakrabortypratik:7CUnFDz6ClmaDqJM@cluster0.8kselrc.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define schema for tasks
const taskSchema = new mongoose.Schema({
  title: String,
  category: String,
  date: Date,
});

// Create Task model
const Task = mongoose.model("Task", taskSchema);

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Define routes for creating and retrieving tasks

// Create a new task
app.post("/tasks", async (req, res) => {
  const { title, category, date } = req.body;
  const task = new Task({ title, category, date });
  await task.save();
  res.send(task);
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// Get a single task by ID
app.get("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send("Task not found");
  res.send(task);
});

//Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) return res.status(404).send("Task not found");   
  res.send({
    message: "Task deleted successfully",
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
