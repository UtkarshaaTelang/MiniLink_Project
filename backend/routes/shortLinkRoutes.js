const express = require("express");
const { createShortLink, getOriginalUrl } = require("../controllers/shortLinkController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createShortLink); // Protected route to create short links
router.get("/:shortCode", getOriginalUrl); // Public route to redirect using short code

module.exports = router;
