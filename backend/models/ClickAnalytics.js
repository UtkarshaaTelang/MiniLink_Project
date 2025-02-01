const mongoose = require("mongoose");

const clickAnalyticsSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  originalUrl: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("ClickAnalytics", clickAnalyticsSchema);
