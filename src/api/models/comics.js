const mongoose = require("mongoose");

const comicSchema = new mongoose.Schema({
    name: {type: String, required: true},
    img: {type: String, required: true},
    year: {type: Number, required: true},
    author: {type: [String], required: true},
    contents: {type: [String]},
    genre: {type: [String]},
    synopsis: {type: String, required: true},
    comments: [{type: mongoose.Types.ObjectId, ref: "comments"}],
}, {
  timestamps: true,
  collection: "comics"
});

const Comic = mongoose.model("comics", comicSchema, "comics");

module.exports = Comic;