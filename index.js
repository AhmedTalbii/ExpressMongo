const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8080;

const conn_str = 'mongodb+srv://obetoxteam:84IwdfN4tmBpbCtG@cluster0.m3xsr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(conn_str, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema
const CommentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true }
});

const Comment = mongoose.model("Comment", CommentSchema);

// Create (POST) a new comment
app.post("/comments", async (req, res) => {
    try {
        const { username, comment } = req.body;
        const newComment = new Comment({ username, comment });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: "Failed to create comment" });
    }
});

// 🔵 Read (GET) all comments
app.get("/comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

// 🟡 Update (PUT) a comment by ID
app.put("/comments/:id", async (req, res) => {
    try {
        const { username, comment } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { username, comment },
            { new: true }
        );
        if (!updatedComment) return res.status(404).json({ error: "Comment not found" });
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(500).json({ error: "Failed to update comment" });
    }
});

// Delete (DELETE) a comment by ID
app.delete("/comments/:id", async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) return res.status(404).json({ error: "Comment not found" });
        res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
