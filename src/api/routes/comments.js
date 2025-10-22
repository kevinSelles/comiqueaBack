const { auth } = require("../../middlewares/auth");
const { postComment, getCommentsByComic } = require("../controllers/comments");
const commentsRouter = require("express").Router();

commentsRouter.post("/", auth, postComment);
commentsRouter.get("/:comicId", getCommentsByComic);

module.exports = commentsRouter;