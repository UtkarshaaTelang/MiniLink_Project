const express = require("express");
const { updateUser, deleteUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);

module.exports = router;
