const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const updateUser = async (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name && !email && !mobile) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update." });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (mobile) updatedData.mobile = mobile;
    let newToken = null;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
      updatedData.email = email;

      newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      token: newToken,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateUser, deleteUser };
