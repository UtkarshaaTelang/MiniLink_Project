const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const shortLinkRoutes = require("./routes/shortLinkRoutes");
const { getOriginalUrl } = require("./controllers/shortLinkController");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({origin: 'https://minilink-client.onrender.com'}));
// app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/shortlink", shortLinkRoutes);

app.use("/api/user", require("./routes/userRoutes"));

app.get("/:shortCode", getOriginalUrl);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
