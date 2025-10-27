const Comic = require("../models/comics");
const User = require("../models/users");

const getComics = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comics = await Comic.find().skip(skip).limit(limit);
    const total = await Comic.countDocuments();

    return res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      comics,
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
    const comic = await Comic.findById(id) .populate({
        path: "comments",
        populate: { path: "user", select: "userName" }
      });

    if (!comic) {
      return res.status(404).json({ message: "Cómic no encontrado" });
    }

    return res.status(200).json(comic);
  } catch (error) {
    return res.status(500).json({
      message: "Error. Cómic no encontrado",
      error: error.message});
  }
};

const escapeRegExp = (str = "") => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getComicsByQuery = async (req, res, next) => {
  try {
    const rawQuery = (req.query.query || "").trim();
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    if (!rawQuery) {
      const total = await Comic.countDocuments();
      const comics = await Comic.find().skip(skip).limit(limit);
      return res.status(200).json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        comics,
      });
    }

    const safe = escapeRegExp(rawQuery);
    const regex = new RegExp(safe, "i");

    const filter = {
      $or: [
        { title: regex },
        { author: regex },
        { isbn: regex },
        { releaseDate: regex },
        { content: regex },
      ],
    };

    const total = await Comic.countDocuments(filter);
    const comics = await Comic.find(filter).skip(skip).limit(limit);

    return res.status(200).json({
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      comics,
    });
  } catch (error) {
    console.error("ERROR en getComicsByQuery:", error && error.stack ? error.stack : error);
    return res.status(500).json({
      message: "Error al buscar cómics en el servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getComicsByYear = async (req, res, next) => {
  try {
    const { year } = req.params;

    const comics = await Comic.find({
      releaseDate: { $regex: year, $options: "i" }
    });

    if (!comics.length) {
      return res.status(404).json({ message: "No se encontraron cómics de ese año." });
    }

    return res.status(200).json(comics);
  } catch (error) {
    return res.status(400).json({
      message: "Error. Inténtelo de nuevo.",
      error: error.message
    });
  }
};

const postComic = async (req, res, next) => {
  try {
    const newComic = new Comic(req.body);
    const comicSaved = await newComic.save();

    if (req.user) {
      try {
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { createdComics: comicSaved._id }
        });
      } catch (userError) {
        console.error("No se pudo actualizar createdComics:", userError);
      }
    }

    return res.status(201).json(comicSaved);
  } catch (error) {
    return res.status(500).json({
      message: "Error. Cómic no publicado. Inténtelo de nuevo.",
      error: error.message
    });
  }
};

const putComic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldComic = await Comic.findById(id);

    if (!oldComic) return res.status(404).json("Cómic no encontrado");

    const comicUpdated = await Comic.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json(comicUpdated);
  } catch (error) {
    return res.status(500).json({
      message: "Error. No se pudo modificar el cómic. Inténtelo de nuevo.",
      error: error.message});
  }
};
const deleteComic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comicDeleted = await Comic.findByIdAndDelete(id);
    return res.status(200).json(comicDeleted);
  } catch (error) {
    return res.status(500).json({
      message: "Error. No se pudo eliminar el cómic. Inténtelo de nuevo",
      error: error.message});
  }
};

module.exports = {
  getComics,
  getComicById,
  getComicsByQuery,
  getComicsByYear,
  postComic,
  putComic,
  deleteComic
};