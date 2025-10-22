const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  comic: { type: mongoose.Types.ObjectId, ref: "comics", required: true },
  user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
}, {
  timestamps: true,
  collection: "comments"
});

const Comment = mongoose.model("comments", commentSchema, "comments");

module.exports = Comment;