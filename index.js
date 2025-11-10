require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const comicsRouter = require("./src/api/routes/comics");
const usersRouter = require("./src/api/routes/users");
const commentsRouter = require("./src/api/routes/comments");
const newsRouter = require("./src/api/routes/news");
const contactRouter = require("./src/api/routes/contact");
const cloudinary = require("cloudinary").v2;

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://comiquea.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Bloqueada petición CORS desde:", origin);
      callback(new Error("CORS not allowed"));
    }
  },
}));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(express.json());

connectDB();

app.use("/api/v1/comics", comicsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/contact", contactRouter);

app.use((req, res, next) => {
  return res.status(404).json("Route not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor levantado en http://localhost:${PORT}`)
);