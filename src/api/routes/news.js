const { getNews } = require("../controllers/news");
const newsRouter = require("express").Router();

newsRouter.get("/", getNews);

module.exports = newsRouter;