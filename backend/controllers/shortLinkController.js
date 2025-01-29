const ShortLink = require("../models/ShortLink");
const crypto = require("crypto");

// const baseUrl = process.env.BASE_URL || "http://localhost:5000"; // Use environment variable for production
// const shortLink = `${baseUrl}/${shortCode}`;

const createShortLink = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Headers:", req.headers);

  const { destinationUrl, linkExpiration } = req.body;

  if (!destinationUrl) {
    return res.status(400).json({ error: "Original URL is required." });
  }

  try {
    const shortCode = crypto.randomBytes(4).toString("hex"); // Generate a random short code

    const newShortLink = new ShortLink({
      destinationUrl,
      shortCode,
      linkExpiration,
      createdBy: req.user._id, // Assuming user is authenticated
    });

    await newShortLink.save();

    res.status(201).json({
      message: "Short link created successfully!",
      shortLink: `${req.protocol}://${req.get("host")}/${shortCode}`,
      shortCode,
    });
  } catch (error) {
    console.error("Error creating short link:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const shortLink = await ShortLink.findOne({ shortCode });

    if (!shortLink) {
      return res.status(404).json({ error: "Short link not found." });
    }

    if (shortLink.linkExpiration && shortLink.linkExpiration < Date.now()) {
      return res.status(410).json({ error: "Short link has expired." });
    }

    res.redirect(shortLink.destinationUrl);
  } catch (error) {
    console.error("Error retrieving original URL:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { createShortLink, getOriginalUrl };
