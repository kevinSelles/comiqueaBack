const Comic = require("../models/comics");
const User = require("../models/users");
const { deleteFile } = require("../../utils/deleteFiles");
const { getSortObject } = require("../../utils/sortComics");

const getComics = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || null;

    const comics = await Comic.find();
    const total = comics.length;

    let sortedComics = [...comics];

    if (sort) {
      const [field, dir] = sort.split("-");
      sortedComics.sort((a, b) => {
        let valA, valB;

        switch (field) {
          case "date":
            valA = a.date?.match(/\d{4}/) ? parseInt(a.date.match(/\d{4}/)[0]) : 0;
            valB = b.date?.match(/\d{4}/) ? parseInt(b.date.match(/\d{4}/)[0]) : 0;
            return dir === "asc" ? valA - valB : valB - valA;

          case "title":
            valA = a.title || "";
            valB = b.title || "";
            return dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);

          case "author":
            valA = Array.isArray(a.authors)
              ? a.authors[0] || ""
              : typeof a.authors === "string"
              ? a.authors
              : "";
            valB = Array.isArray(b.authors)
              ? b.authors[0] || ""
              : typeof b.authors === "string"
              ? b.authors
              : "";
            return dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);

          default:
            return 0;
        }
      });
    }

    const paginatedComics = sortedComics.slice(skip, skip + limit);

    return res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      comics: paginatedComics,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error. Cómics no encontrados",
      error: error.message,
    });
  }
};

const getComicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comic = await Comic.findById(id).populate({
      path: "comments",
      populate: { path: "user", select: "userName" },
    });

    if (!comic) {
      return res.status(404).json({ message: "Cómic no encontrado" });
    }

    return res.status(200).json(comic);
  } catch (error) {
    return res.status(500).json({
      message: "Error. Cómic no encontrado",
      error: error.message,
    });
  }
};

const getComicsByQuery = async (req, res, next) => {
  try {
    const rawQuery = (req.query.query || "").trim();
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || null;

    let filter = {};
    if (rawQuery) {
      const safe = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe, "i");
      filter = {
        $or: [
          { title: regex },
          { authors: regex },
          { isbn: regex },
          { date: regex },
          { description: regex },
          { serie: regex },
          { publisher: regex },
          { language: regex },
        ],
      };
    }

    const comics = await Comic.find(filter);
    const total = comics.length;

    let sortedComics = [...comics];

    if (sort) {
      const [field, dir] = sort.split("-");
      sortedComics.sort((a, b) => {
        let valA, valB;

        switch (field) {
          case "date":
            valA = a.date?.match(/\d{4}/) ? parseInt(a.date.match(/\d{4}/)[0]) : 0;
            valB = b.date?.match(/\d{4}/) ? parseInt(b.date.match(/\d{4}/)[0]) : 0;
            return dir === "asc" ? valA - valB : valB - valA;

          case "title":
            valA = a.title || "";
            valB = b.title || "";
            return dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);

          case "author":
            valA = Array.isArray(a.authors)
              ? a.authors[0] || ""
              : typeof a.authors === "string"
              ? a.authors
              : "";
            valB = Array.isArray(b.authors)
              ? b.authors[0] || ""
              : typeof b.authors === "string"
              ? b.authors
              : "";
            return dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);

          default:
            return 0;
        }
      });
    }

    const paginatedComics = sortedComics.slice(skip, skip + limit);

    return res.status(200).json({
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      comics: paginatedComics,
    });
  } catch (error) {
    console.error("ERROR en getComicsByQuery:", error);
    return res.status(500).json({
      message: "Error al buscar cómics en el servidor",
      error: error.message,
    });
  }
};

const getComicsByYear = async (req, res, next) => {
  try {
    const { year } = req.params;
    const comics = await Comic.find({ date: { $regex: year, $options: "i" } });

    if (!comics.length) {
      return res.status(404).json({ message: "No se encontraron cómics de ese año." });
    }

    return res.status(200).json(comics);
  } catch (error) {
    return res.status(400).json({
      message: "Error. Inténtelo de nuevo.",
      error: error.message,
    });
  }
};

const postComic = async (req, res) => {
  let imageUrl = "";

  try {
    const { title, description, isbn, authors } = req.body;
    if (req.file) imageUrl = req.file.path;

    if (!title || !description || !isbn || !authors) {
      if (imageUrl) await deleteFile(imageUrl);
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existing = await Comic.findOne({ isbn: isbn.trim() });
    if (existing) {
      if (imageUrl) await deleteFile(imageUrl);
      return res.status(400).json({ message: "Ya existe un cómic con ese ISBN" });
    }

    let authorsArray = [];
    if (typeof authors === "string") {
      try {
        authorsArray = JSON.parse(authors);
        if (!Array.isArray(authorsArray)) throw new Error();
      } catch {
        authorsArray = authors.split(",").map(a => a.trim()).filter(a => a);
      }
    } else if (Array.isArray(authors)) {
      authorsArray = authors.map(a => a.trim());
    }

    const newComic = new Comic({
      ...req.body,
      isbn: isbn.trim(),
      authors: authorsArray,
      img: imageUrl,
    });

    const comicSaved = await newComic.save();

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { createdComics: comicSaved._id },
      });
    }

    return res.status(201).json(comicSaved);
  } catch (error) {
    if (imageUrl) await deleteFile(imageUrl);
    return res.status(500).json({
      message: "Error. Cómic no publicado.",
      error: error.message,
    });
  }
};

const putComic = async (req, res) => {
  let newImageUrl = "";

  try {
    const { id } = req.params;
    const oldComic = await Comic.findById(id);
    if (!oldComic) return res.status(404).json({ message: "Cómic no encontrado" });

    const { title, description, isbn, authors, date, publisher, format, serie, language } = req.body;

    if (!title || !description || !isbn || !authors) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    let authorsArray = [];
    if (typeof authors === "string") {
      try {
        authorsArray = JSON.parse(authors);
        if (!Array.isArray(authorsArray)) throw new Error();
      } catch {
        authorsArray = authors.split(",").map(a => a.trim()).filter(a => a);
      }
    } else if (Array.isArray(authors)) {
      authorsArray = authors.map(a => a.trim());
    }

    const updateData = {
      title,
      description,
      isbn: isbn.trim(),
      authors: authorsArray,
      date,
      publisher,
      serie,
      language,
      format,
    };

    if (req.file) {
      newImageUrl = req.file.path;
      updateData.img = newImageUrl;
    }

    const comicUpdated = await Comic.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (req.file && oldComic.img) {
      await deleteFile(oldComic.img);
    }

    return res.status(200).json(comicUpdated);
  } catch (error) {
    if (newImageUrl) await deleteFile(newImageUrl);
    console.error("PUT /comics/:id error:", error);
    return res.status(500).json({
      message: "Error. No se pudo modificar el cómic.",
      error: error.message,
    });
  }
};

const deleteComic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comicDeleted = await Comic.findByIdAndDelete(id);

    if (!comicDeleted) {
      return res.status(404).json({ message: "Cómic no encontrado" });
    }

    if (comicDeleted.img && comicDeleted.img.includes("res.cloudinary.com")) {
      try {
        await deleteFile(comicDeleted.img);
      } catch (err) {
        console.warn("⚠️ No se pudo eliminar la imagen de Cloudinary:", err.message);
      }
    }

    await User.updateMany(
      { createdComics: id },
      { $pull: { createdComics: id } }
    );

    return res.status(200).json({
      message: "✅ Cómic eliminado correctamente",
      comic: comicDeleted,
    });
  } catch (error) {
    console.error("Error al eliminar cómic:", error);
    return res.status(500).json({
      message: "Error. No se pudo eliminar el cómic.",
      error: error.message,
    });
  }
};

module.exports = {
  getComics,
  getComicById,
  getComicsByQuery,
  getComicsByYear,
  postComic,
  putComic,
  deleteComic,
};