require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("../../config/db");
const Comic = require("../../api/models/comics");
const comics = require("./data/comicsSeed.json");

const seedComics = async () => {
  try {
    await connectDB();
    await Comic.deleteMany();
    console.log("Cómics borrados");

  const dataComics = comics
  .filter(comic => comic.isbn && comic.isbn.trim() !== "")
  .map(comic => ({
    title: comic.title,
    image: comic.image,
    content: comic.collection,
    releaseDate: comic.releaseDate,
    synopsis: comic.synopsis,
    editorial: comic.editorial,
    author: comic.author ? comic.author.split(",").map(a => a.trim()) : [],
    pages: comic.pages ? Number(comic.pages) : null,
    isbn: comic.isbn,
    comments: []
  }));

    await Comic.insertMany(dataComics);
    console.log(`${dataComics.length} cómics insertados correctamente`);
  } catch (error) {
    console.error("Error al cargar la semilla", error);
  } finally {
    await mongoose.disconnect();
    console.log("Conexión a la BBDD cerrada");
  }
};

seedComics();