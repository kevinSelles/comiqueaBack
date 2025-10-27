const { adminAuth } = require("../../middlewares/auth");
const { getComics, getComicById, getComicsByQuery, getComicsByYear, postComic, putComic, deleteComic } = require("../controllers/comics");
const comicsRouter = require("express").Router();

comicsRouter.get("/year/:year", getComicsByYear);
comicsRouter.get("/search", getComicsByQuery);
comicsRouter.get("/:id", getComicById);
comicsRouter.get("/", getComics);
comicsRouter.post("/", postComic);
comicsRouter.put("/:id", adminAuth, putComic);
comicsRouter.delete("/:id", adminAuth, deleteComic);

module.exports = comicsRouter;