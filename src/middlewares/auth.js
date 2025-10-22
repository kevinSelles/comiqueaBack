const User = require("../api/models/users");
const { verifyToken } = require("../config/jwt");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Falta el token de autorización" });
    }

    const parsedToken = token.replace("Bearer ", "");
    const { id } = verifyToken(parsedToken);
    const user = await User.findById(id).select("-password");
    req.user = user;
    
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Error de autenticación.",
      error: error.message});
  }
}

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

     if (!token) {
      return res.status(401).json({ message: "Falta el token de autorización" });
    }

    const parsedToken = token.replace("Bearer ", "");
    const { id } = verifyToken(parsedToken);
    const user = await User.findById(id);

    if (user.rol === "admin") {
      user.password =undefined;
      req.user = user;
      next()
    } else {
      return res.status(403).json("No eres admin.");
    }
    
  } catch (error) {
    return res.status(401).json({
      message: "Error de autenticación",
      error: error.message});
  }
}

module.exports = { auth, adminAuth }