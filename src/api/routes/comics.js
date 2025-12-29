const { adminAuth, auth } = require("../../middlewares/auth");
const { getComics, getComicById, getComicsByQuery, getComicsByYear, postComic, putComic, deleteComic } = require("../controllers/comics");
const comicsRouter = require("express").Router();
const upload = require("../../middlewares/file");

comicsRouter.get("/year/:year", getComicsByYear);
comicsRouter.get("/search", getComicsByQuery);
comicsRouter.get("/:id", getComicById);
comicsRouter.get("/", getComics);
comicsRouter.post("/", auth, upload.single("image"), postComic);
comicsRouter.put("/:id", adminAuth, upload.single("image"), putComic);
comicsRouter.delete("/:id", adminAuth, deleteComic);

module.exports = comicsRouter;