const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/registrations.json");

exports.verifyTicket = (req, res) => {
  const { paymentId } = req.body;

  if (!fs.existsSync(dataPath)) {
    return res.json({ status: "INVALID" });
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const user = data.find(u => u.paymentId === paymentId);

  if (!user) {
    return res.json({ status: "INVALID" });
  }

  if (user.checkedIn) {
    return res.json({ status: "ALREADY_USED" });
  }

  // Mark entry
  user.checkedIn = true;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.json({
    status: "VALID",
    name: user.name,
    event: user.event
  });
};
