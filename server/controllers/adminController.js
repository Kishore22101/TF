const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/registrations.json");

exports.getRegistrations = (req, res) => {
  try {
    // If file does not exist → return empty array
    if (!fs.existsSync(dataPath)) {
      return res.json([]);
    }

    const fileData = fs.readFileSync(dataPath, "utf-8");

    // If file is empty → return empty array
    if (!fileData) {
      return res.json([]);
    }

    const registrations = JSON.parse(fileData);
    res.json(registrations);

  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({
      message: "Error reading registration data"
    });
  }
};
