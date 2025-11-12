function getSortObject(sort) {
  switch (sort) {
    case "title-asc":
      return { title: 1 };
    case "title-desc":
      return { title: -1 };
    case "date-asc":
      return { date: 1 };
    case "date-desc":
      return { date: -1 };
    case "author-asc":
      return { "authors.0": 1 };
    case "author-desc":
      return { "authors.0": -1 };
    default:
      return {};
  }
}

module.exports = { getSortObject };