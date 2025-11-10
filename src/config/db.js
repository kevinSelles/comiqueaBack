const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Conectado a la bbdd");
    
  } catch (error) {
    console.error("No se pudo conectar a la bbdd", error);
  }
}

module.exports = { connectDB };