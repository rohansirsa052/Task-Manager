const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors"); 

app.use(
  cors({
    origin: "http://localhost:3000", 
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/task_manager")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));


const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  }
});


const Task = new mongoose.model("Task", taskSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/tasks", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const newTask = Task({
      title,
      description,
      status
    });

    const result = await newTask.save();
    res.status(201).json(result); 
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const result = await Task.find({}); //   .sort({ Ranking: 1 });  is used to sort data on the basis of ranking
    res.json(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch("/tasks/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const updatedTask = await Task.findOneAndUpdate(
      { title: title }, 
      { status: "Completed" }, 
      { new: true } 
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json("updated successfully");
  } catch (err) {
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

app.delete("/tasks/:title", async (req, res) => {
  try {
    const title = req.params.title;
    console.log(title);
    const result = await Task.findOneAndDelete({ title: title });
    if (result===null) {
      console.log(result);
      return res.status(404).json({ error: "Task not found." });
    }
   // console.log(result);
    res.send("Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  
  }
});


const port = process.env.PORT || 8070;
app.listen(port, () => console.log(`Server running at ${port}`));
