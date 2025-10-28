const { Router } = require("express");
const { sendContact } = require("../controllers/contact");

const router = Router();

router.post("/", sendContact);

module.exports = router;