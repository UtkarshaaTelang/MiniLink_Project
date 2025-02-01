const ShortLink = require("../models/ShortLink");
const crypto = require("crypto");
const ClickAnalytics = require("../models/ClickAnalytics");
const moment = require("moment");

//Generate short code
const generateShortCode = async (url) => {
  let counter = 0;
  let shortCode;

  do {
    const hash = crypto.createHash("sha256");
    hash.update(url + counter);
    shortCode = hash.digest("hex").slice(0, 8);

    // Check if this shortCode already exists in the database
    const existingLink = await ShortLink.findOne({ shortCode });
    if (!existingLink) {
      return shortCode;
    }

    counter++;
  } while (true);
};

//create short link
const createShortLink = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Headers:", req.headers);

  const { destinationUrl, linkExpiration, remarks } = req.body;
  const userId = req.user._id;

  if (!destinationUrl) {
    return res.status(400).json({ error: "Original URL is required." });
  }

  try {
    const shortCode = await generateShortCode(destinationUrl);

    const existingLink = await ShortLink.findOne({
      destinationUrl,
      createdBy: userId,
    });

    if (existingLink) {
      return res.status(400).json({ error: "The link already exists." });
    }

    const newShortLink = new ShortLink({
      destinationUrl,
      shortCode,
      remarks,
      linkExpiration,
      createdBy: req.user._id,
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

//get original link
const getOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;
  const userAgent = req.headers["user-agent"];
  const ipAddress =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const shortLink = await ShortLink.findOne({ shortCode });

    if (!shortLink) {
      return res.status(404).json({ error: "Short link not found." });
    }

    if (shortLink.linkExpiration && shortLink.linkExpiration < Date.now()) {
      return res.status(410).json({ error: "Short link has expired." });
    }

    shortLink.clicks += 1;
    await shortLink.save();

    await ClickAnalytics.create({
      shortCode,
      originalUrl: shortLink.destinationUrl,
      ipAddress,
      userAgent,
      createdBy: shortLink.createdBy,
    });

    res.redirect(shortLink.destinationUrl);
  } catch (error) {
    console.error("Error retrieving original URL:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//get all links
const getAllLinks = async (req, res) => {
  try {
    const userId = req.user._id;
    let { page = 1, limit = 7 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalLinks = await ShortLink.countDocuments({ createdBy: userId });
    const totalPages = Math.ceil(totalLinks / limit);

    const links = await ShortLink.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      links,
      totalLinks,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//delete links
const deleteShortLink = async (req, res) => {
  try {
    const { id } = req.params;
    await ShortLink.findByIdAndDelete(id);
    res.json({ message: "Short link deleted successfully." });
  } catch (error) {
    console.error("Error deleting short link:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//edit links
const updateShortLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { destinationUrl, remarks, linkExpiration } = req.body;

    const updatedLink = await ShortLink.findByIdAndUpdate(
      id,
      { destinationUrl, remarks, linkExpiration },
      { new: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ error: "Short link not found" });
    }

    res.json(updatedLink);
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const BASE_URL = "https://final-evaluation-test-2.onrender.com";
//get analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    let { page = 1, limit = 7 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const totalRecords = await ClickAnalytics.countDocuments({
      createdBy: userId,
    });
    const totalPages = Math.ceil(totalRecords / limit);

    const analytics = await ClickAnalytics.find({ createdBy: userId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedAnalytics = analytics.map((entry) => ({
      ...entry._doc,
      shortLink: `${BASE_URL}/${entry.shortCode}`, // ✅ Adds full URL for short links
    }));
    
    res.status(200).json({
      analytics: formattedAnalytics,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//get dashboard analytics
const getHomePageAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const analytics = await ClickAnalytics.find({ createdBy: userId }).sort({
      timestamp: -1,
    });

    // Total Clicks
    const totalClicks = analytics.length;

    // Date-wise Clicks (Cumulative Last 5 Days)
    const dateClicksMap = {};
    let cumulativeClicks = 0;

    analytics.forEach((entry) => {
      const date = new Date(entry.timestamp).toISOString().split("T")[0];
      if (!dateClicksMap[date]) {
        dateClicksMap[date] = 0;
      }
      dateClicksMap[date]++;
    });

    const sortedDates = Object.keys(dateClicksMap).sort().slice(-5);
    const cumulativeDateClicks = sortedDates.map((date) => {
      cumulativeClicks += dateClicksMap[date];
      return { date, clicks: cumulativeClicks };
    });

    // Device-wise Clicks
    const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };

    analytics.forEach((entry) => {
      const userAgent = entry.userAgent.toLowerCase();
      if (userAgent.includes("mobile")) {
        deviceCounts.Mobile++;
      } else if (userAgent.includes("tablet")) {
        deviceCounts.Tablet++;
      } else {
        deviceCounts.Desktop++;
      }
    });

    res.status(200).json({
      totalClicks,
      datewiseClicks: cumulativeDateClicks.reverse(),
      deviceClicks: deviceCounts,
    });
  } catch (error) {
    console.error("Error fetching homepage analytics:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//search links
const searchLinks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query, page = 1, limit = 7 } = req.query;

    console.log("Search Query Received:", query);
    console.log("User ID:", userId);

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchRegex = new RegExp(
      query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    let filter = { createdBy: userId, $or: [] };

    const parsedDate = moment(
      query,
      ["MMM D", "YYYY-MM-DD", "MMM D, YYYY"],
      true
    );
    if (parsedDate.isValid()) {
      console.log("Searching by Date:", parsedDate.format("YYYY-MM-DD"));

      const startOfDayUTC = moment(parsedDate).utc().startOf("day").toDate();
      const endOfDayUTC = moment(parsedDate).utc().endOf("day").toDate();

      filter.$or.push({
        createdAt: {
          $gte: startOfDayUTC,
          $lt: endOfDayUTC,
        },
      });

      console.log("🛠 Fixed Date Filter:", { startOfDayUTC, endOfDayUTC });
    } else {
      switch (query.toLowerCase()) {
        case "active":
          console.log("Searching for Active Links");
          filter.$or.push(
            { linkExpiration: { $gt: new Date() } },
            { linkExpiration: null }
          );
          break;

        case "inactive":
          console.log("Searching for Inactive Links");
          filter.$or.push({ linkExpiration: { $lte: new Date() } });
          break;

        default:
          console.log(
            "Searching for Original Link / Short Link / Remarks:",
            query
          );
          filter.$or.push(
            { destinationUrl: { $regex: searchRegex } },
            { shortCode: { $regex: searchRegex } },
            { remarks: { $regex: searchRegex } }
          );

          if (query.includes("http://") || query.includes("https://")) {
            const extractedShortCode = query.split("/").pop();
            console.log("🔗 Extracted Short Code:", extractedShortCode);
            filter.$or.push({ shortCode: extractedShortCode });
          }
      }
    }

    console.log("🛠 Applied Filter:", JSON.stringify(filter, null, 2));

    const totalLinks = await ShortLink.countDocuments(filter);
    const totalPages = Math.ceil(totalLinks / limit);

    const links = await ShortLink.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Filtered Results Count:", links.length);
    res.status(200).json({
      links,
      totalLinks,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error in searchLinks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createShortLink,
  getOriginalUrl,
  getAllLinks,
  deleteShortLink,
  updateShortLink,
  getAnalytics,
  getHomePageAnalytics,
  searchLinks,
};
