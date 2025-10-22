const { generateToken } = require("../../config/jwt");
const User = require("../models/users");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").populate("createdComics");

    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    newUser.rol = "user";

    const duplicateUser = await User.findOne({userName: newUser.userName});
    if(duplicateUser !== null) {
      return res.status(400).json("Alguien se te adelantó al elegir nombre. Tendrás que buscar otro.");
    };

    const duplicateEmail = await User.findOne({email: newUser.email});
    if(duplicateEmail !== null) {
      return res.status(400).json("Este email ya está en uso por algún usuario.");
    };

    const userSaved = await newUser.save();
    const userResponse = await User.findById(userSaved._id).select("-password");

    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({userName: req.body.userName})

    if(user === null) {
      return res.status(400).json("Este usuario no existe.");
    }
    if(bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user._id);
      const userResponse = await User.findById(user._id).select("-password");
      return res.status(200).json({ userResponse, token });
    } else {
      return res.status(400).json("Contraseña incorrecta.");
    };
  } catch (error) {
    return res.status(401).json(error);
  }
}

const putUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if(req.user._id.toString() !== id && req.user.rol !== "admin") {
      return res.status(403).json("Solo los admins y el dueño de la cuenta pueden modificar los datos.");
    };

    if (req.user.rol !== "admin" && req.body.rol) {
      delete req.body.rol;
    };

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    };

    const userUpdated = await User.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}).select("-password");

    if (!userUpdated) {
      return res.status(404).json("Usuario no encontrado");
    };

    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(500).json({
      message: "Error. No se pudo modificar al usuario.",
      error: error.message});
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if(req.user._id.toString() !== id && req.user.rol !== "admin") {
    return res.status(403).json("Solo los admins o el dueño de la cuenta pueden borrar al usuario.");
    }

    const userDeleted = await User.findByIdAndDelete(id).select("-password");
    return res.status(200).json(userDeleted);
  } catch (error) {
    return res.status(500).json({
      message: "Error. No se pudo eliminar al usuario.",
      error: error.message});
  }
}

module.exports = { getUsers, getUserById, postUser, login, deleteUser, putUser };