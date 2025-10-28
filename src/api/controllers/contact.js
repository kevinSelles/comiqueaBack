const transporter = require("../../config/nodemailer");

const sendContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Faltan campos" });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email no válido" });
  };

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `Consulta de ${name}`,
      text: message,
      html: `<p>${message}</p><p>De: ${name} (${email})</p>`,
    });

    return res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ message: "No se pudo enviar el correo", error: error.message });
  }
};

module.exports = { sendContact };