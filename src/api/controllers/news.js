const { fetchBlogNews } = require("../../utils/fetchBlogNews");

const getNews = async (req, res) => {
  const news = await fetchBlogNews();
  res.status(200).json(news);
};

module.exports = { getNews };