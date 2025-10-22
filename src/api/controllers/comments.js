const Comment = require("../models/comments");
const Comic = require("../models/comics");
const User = require("../models/users");

const postComment = async (req, res, next) => {
  try {
    const { comicId, content } = req.body;

    if (!req.user) return res.status(401).json("Debes iniciar sesión para comentar");

    const newComment = new Comment({
      content,
      comic: comicId,
      user: req.user._id
    });

    const commentSaved = await newComment.save();

    await Comic.findByIdAndUpdate(comicId, { $push: { comments: commentSaved._id } });
    await User.findByIdAndUpdate(req.user._id, { $push: { comments: commentSaved._id } });

    return res.status(201).json(commentSaved);
  } catch (error) {
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