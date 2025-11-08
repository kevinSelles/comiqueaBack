const mongoose = require("mongoose");

const comicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: String, trim: true, default: null },
  authors: { type: [String], default: [] },
  isbn: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  serie: { type: String, trim: true, default: null },
  img: { type: String, trim: true },
  publisher: { type: String, trim: true, default: null },
  language: { type: String, trim: true, default: null },
  format: { type: String, trim: true, default: null },
  comments: [{ type: mongoose.Types.ObjectId, ref: "comments" }]
}, {
  timestamps: true,
  collection: "comics"
});

const Comic = mongoose.model("Comic", comicSchema, "comics");

module.exports = Comic;