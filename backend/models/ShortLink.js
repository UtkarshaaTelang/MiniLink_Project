const mongoose = require("mongoose");

const shortLinkSchema = new mongoose.Schema({
  destinationUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  remarks: {type: String, required: true },
  linkExpiration: { type: Date },
  clicks: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Associate with user
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ShortLink", shortLinkSchema);
