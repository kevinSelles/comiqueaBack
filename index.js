require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const comicsRouter = require("./src/api/routes/comics");
const usersRouter = require("./src/api/routes/users");
const commentsRouter = require("./src/api/routes/comments");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1/comics", comicsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);

app.use((req, res, next) => {
  return res.status(404).json("Route not found");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor levantado en http://localhost:${PORT}`));