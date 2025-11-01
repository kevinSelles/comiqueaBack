const mongoose = require("mongoose");

const comicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  image: { type: String },
  content: { type: String, trim: true },
  releaseDate: { type: String, trim: true },
  synopsis: { type: String, required: true, trim: true },
  editorial: { type: String, trim: true },
  author: { type: [String], required: true },
  pages: { type: Number },
  isbn: { type: String, required: true, unique: true, trim: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: "comments" }]
}, {
  timestamps: true,
  collection: "comics"
});

const Comic = mongoose.model("comics", comicSchema, "comics");

module.exports = Comic;