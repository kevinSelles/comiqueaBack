const mongoose = require("mongoose");

const comicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  content: { type: String },
  releaseDate: { type: String },
  synopsis: { type: String, required: true },
  editorial: { type: String },
  author: { type: [String], required: true },
  pages: { type: Number },
  isbn: { type: String, required: true, unique: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: "comments" }]
}, {
  timestamps: true,
  collection: "comics"
});

const Comic = mongoose.model("comics", comicSchema, "comics");

module.exports = Comic;