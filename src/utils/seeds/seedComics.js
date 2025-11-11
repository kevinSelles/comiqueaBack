require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("../../config/db");
const Comic = require("../../api/models/comics");
const comics = require("./data/comicsSeed.json");

const seedComics = async () => {
  try {
    await connectDB();
    console.log("✅ Conectado a MongoDB Atlas");
    await Comic.deleteMany();
    console.log("🗑️ Colección 'comics' borrada correctamente");

    const seenIsbns = new Set();

    const dataComics = comics
      .map((comic) => {
        if (!comic.isbn) return null;

        let cleanIsbn = comic.isbn
          .split(",")[0]
          .replace(/[-\s]/g, "")
          .trim();

        if (!cleanIsbn || seenIsbns.has(cleanIsbn)) return null;
        seenIsbns.add(cleanIsbn);

        const hasTitle = comic.title && comic.title.trim().length > 0;
        const hasImg = comic.img && comic.img.trim().length > 0;

        if (!hasTitle || !hasImg) {
          console.warn(`⚠️ Comic con ISBN ${cleanIsbn} descartado por faltar título o imagen`);
          return null;
        }

        return {
          title: comic.title.trim(),
          date: comic.date || null,
          authors: Array.isArray(comic.authors)
            ? comic.authors.map((a) => a.trim()).filter(Boolean)
            : [],
          isbn: cleanIsbn,
          description: comic.description?.trim() || "",
          serie: comic.collection || "",
          img: comic.img.trim(),
          publisher: comic.publisher || "",
          language: comic.language || "",
          format: comic.format || "",
          comments: []
        };
      })
      .filter(Boolean);

    console.log(`📦 Total cómics únicos válidos para insertar: ${dataComics.length}`);

    await Comic.insertMany(dataComics);
    console.log(`✅ ${dataComics.length} cómics insertados correctamente en Mongo Atlas`);

  } catch (error) {
    console.error("❌ Error al cargar la semilla:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexión a la BBDD cerrada");
  }
};

seedComics();