const mongoose = require("mongoose");

const shortLinkSchema = new mongoose.Schema({
  destinationUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  linkExpiration: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Associate with user
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ShortLink", shortLinkSchema);
