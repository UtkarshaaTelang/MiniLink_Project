const express = require("express");
const ClickAnalytics = require("../models/ClickAnalytics");
const { createShortLink, getOriginalUrl, getAllLinks, deleteShortLink, updateShortLink, getAnalytics, getHomePageAnalytics, searchLinks } = require("../controllers/shortLinkController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createShortLink); // Protected route to create short links
router.get("/all", authMiddleware, getAllLinks);
router.get("/analytics", authMiddleware, getAnalytics);
router.get("/home-analytics", authMiddleware, getHomePageAnalytics);
router.get("/search", authMiddleware, searchLinks);
router.put("/:id", authMiddleware, updateShortLink);
router.delete("/:id", authMiddleware, deleteShortLink);
router.get("/:shortCode", getOriginalUrl); // Public route to redirect using short code


module.exports = router;
