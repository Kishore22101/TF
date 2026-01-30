const express = require("express");
const cors = require("cors");

const registerRoutes = require("./routes/registerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const workshopRoutes = require("./routes/workshopRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 TechFest Backend Running");
});

app.use("/register", registerRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/verify", verifyRoutes);
app.use("/", workshopRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
