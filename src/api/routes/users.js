const { adminAuth, auth } = require("../../middlewares/auth");
const {
  getUsers,
  getUserById,
  postUser,
  login,
  deleteUser,
  putUser,
  toggleComicInList,
  createCustomList,
  toggleComicInCustomList,
  deleteCustomList
} = require("../controllers/users");

const usersRouter = require("express").Router();

usersRouter.get("/", adminAuth, getUsers);
usersRouter.get("/:id", auth, getUserById);
usersRouter.post("/register", postUser);
usersRouter.post("/login", login);
usersRouter.put("/:id", auth, putUser);
usersRouter.delete("/:id", auth, deleteUser);
usersRouter.put("/lists/:listName", auth, toggleComicInList);
usersRouter.post("/lists", auth, createCustomList);
usersRouter.put("/lists/custom/:listId", auth, toggleComicInCustomList);
usersRouter.delete("/lists/custom/:listId", auth, deleteCustomList);

module.exports = usersRouter;