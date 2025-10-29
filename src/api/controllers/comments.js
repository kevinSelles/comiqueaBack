const Comment = require("../models/comments");
const Comic = require("../models/comics");
const User = require("../models/users");

const postComment = async (req, res, next) => {
  try {
    const { comic, content } = req.body;

    if (!req.user) return res.status(401).json("Debes iniciar sesión para comentar");
    if (!comic || !content) return res.status(400).json("Faltan datos para el comentario");

    const newComment = new Comment({
      content,
      comic,
      user: req.user._id
    });

    const commentSaved = await newComment.save();

    await Comic.findByIdAndUpdate(comic, { $push: { comments: commentSaved._id } });
    await User.findByIdAndUpdate(req.user._id, { $push: { comments: commentSaved._id } });

    return res.status(201).json(commentSaved);
  } catch (error) {
    console.error("Error creando comentario:", error);
    return res.status(500).json({
      message: "No se pudo publicar el comentario",
      error: error.message
    });
  }
};

const getCommentsByComic = async (req, res, next) => {
  try {
    const { comicId } = req.params;

    const comments = await Comment.find({ comic: comicId })
      .populate("user", "userName")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({
      message: "No se pudieron obtener los comentarios",
      error: error.message
    });
  }
};

module.exports = { postComment, getCommentsByComic };