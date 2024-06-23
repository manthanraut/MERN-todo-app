const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost/mern-stack-db', { useNewUrlParser: true, useUnifiedTopology: true });

const todoSchema = new mongoose.Schema({
    task: String,
    completed: Boolean
});

const ToDo = mongoose.model('Todo', todoSchema);

// Fetch Todos
app.get('/todos', async (req, res) => {
    const todos = await ToDo.find();
    res.json(todos);
});

// Create a new todo
app.post('/todos', async (req, res) => {
    const newTodo = new ToDo(req.body);
    await newTodo.save();
    res.json(newTodo);
});

// Update an existing todo
app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true});
    res.json(updatedTodo);
});

// Reset todos
app.delete('/todos', async (req, res) => {
    try {
        await ToDo.deleteMany({});
        res.json({ message: 'All todos deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting todos', error: err.message });
    }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    await ToDo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
});

// Define routes and middleware
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});