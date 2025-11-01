const cloudinary = require("cloudinary").v2;

const deleteFile = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    const parts = imageUrl.split("/");
    const folderName = parts.at(-2);
    const fileName = parts.at(-1).split(".")[0];

    const result = await cloudinary.uploader.destroy(`${folderName}/${fileName}`);
    if (result.result !== "ok") {
      console.warn(`No se pudo eliminar la imagen: ${imageUrl}`, result);
    }
  } catch (error) {
    console.error("Error borrando imagen en Cloudinary:", error);
  }
};

module.exports = { deleteFile };