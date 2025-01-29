// Placeholder for authentication middleware
// const protect = (req, res, next) => {
//     res.status(200).json({ message: 'Auth middleware' });
//     next();
//   };
//   module.exports = protect;
  
const jwt = require('jsonwebtoken'); // Assuming you're using JWT
const User = require('../models/User'); // Assuming you have a User model

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
    next(); // Proceed to next middleware or route
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = protect;
