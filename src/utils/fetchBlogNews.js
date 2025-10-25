const { parseStringPromise } = require("xml2js");

const fetchBlogNews = async () => {
  try {
    const rssUrl = "https://www.elnuevofriki.es/rss.xml";
    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const xml = await response.text();
    const result = await parseStringPromise(xml, { explicitArray: false });

    const items = result?.rss?.channel?.item || [];

    const articles = items.map(item => {
      let image = item["media:thumbnail"]?.$.url;

      if (!image) {
        const imgMatch = item.description?.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch) image = imgMatch[1];
      }

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description
          ?.replace(/<\/?[^>]+(>|$)/g, "")
          .trim()
          .slice(0, 200) + "...",
        image
      };
    });

    return articles;
  } catch (error) {
    console.error("Error al obtener noticias del blog:", error.message);
    return [];
  }
};

module.exports = { fetchBlogNews };