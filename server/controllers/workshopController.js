const fs = require("fs");
const path = require("path");

const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

const workshops = require("../data/workshops.json");

const regPath = path.join(__dirname, "../data/workshop-registrations.json");
const slotPath = path.join(__dirname, "../data/workshop-slots.json");

exports.registerWorkshop = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      workshop,
      college,
      degree,
      dept,
      year,
      paymentId
    } = req.body;

    /* -------------------------------
       1️⃣ VALIDATE WORKSHOP
    --------------------------------*/
    const workshopDetails = workshops[workshop];

    if (!workshopDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid workshop selected"
      });
    }

    const amount = workshopDetails.price;

    /* -------------------------------
       2️⃣ VALIDATE PARTICIPANT
    --------------------------------*/
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required"
      });
    }

    /* -------------------------------
       3️⃣ SLOT CHECK
    --------------------------------*/
    const slots = JSON.parse(fs.readFileSync(slotPath, "utf-8"));

    if (!slots[workshop] || slots[workshop] <= 0) {
      return res.status(400).json({
        success: false,
        message: "Slots full for this workshop"
      });
    }

    /* -------------------------------
       4️⃣ READ REGISTRATIONS
    --------------------------------*/
    let registrations = [];
    if (fs.existsSync(regPath)) {
      const fileData = fs.readFileSync(regPath, "utf-8");
      if (fileData.trim()) {
        registrations = JSON.parse(fileData);
      }
    }

    /* -------------------------------
       5️⃣ SAVE REGISTRATION
    --------------------------------*/
    const newEntry = {
      workshop,
      amount,
      name,
      email,
      phone,
      college,
      degree,
      dept,
      year,
      paymentId,
      checkedIn: false,
      time: new Date().toLocaleString()
    };

    registrations.push(newEntry);
    fs.writeFileSync(regPath, JSON.stringify(registrations, null, 2));

    /* -------------------------------
       6️⃣ DECREMENT SLOT
    --------------------------------*/
    slots[workshop] -= 1;
    fs.writeFileSync(slotPath, JSON.stringify(slots, null, 2));

    /* -------------------------------
       7️⃣ SEND EMAIL + SMS
    --------------------------------*/
    await sendEmail(email, name, workshop, paymentId);
    await sendSMS(phone, workshop);

    res.json({
      success: true,
      message: "Workshop registration successful"
    });

  } catch (err) {
    console.error("Workshop Register Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
