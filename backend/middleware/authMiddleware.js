const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Unauthorized: No token provided.");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = protect;
