const fs = require("fs");
const path = require("path");

const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

const events = require("../data/events.json");

const regPath = path.join(__dirname, "../data/registrations.json");
const slotPath = path.join(__dirname, "../data/slots.json");

exports.registerUser = async (req, res) => {
  try {
    const {
      event,
      leaderName,
      teamMembers,   // array of objects with name, college, dept, year
      email,
      phone,
      paymentId
    } = req.body;

    /* -------------------------------
       1️⃣ VALIDATE EVENT
    --------------------------------*/
    const eventDetails = events[event];

    if (!eventDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid event selected"
      });
    }

    const amount = eventDetails.price;
    const type = eventDetails.type;
    const maxTeamSize = eventDetails.maxTeamSize;

    /* -------------------------------
       2️⃣ VALIDATE TEAM LOGIC
    --------------------------------*/
    if (!leaderName) {
      return res.status(400).json({
        success: false,
        message: "Participant 1 name is required"
      });
    }

    let finalTeam = [leaderName];

    if (type === "TEAM" && Array.isArray(teamMembers)) {
      const filtered = teamMembers.filter(m => m && m.name && m.name.trim() !== "");
      finalTeam = finalTeam.concat(filtered.map(m => m.name));

      if (finalTeam.length > maxTeamSize) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${maxTeamSize} members allowed`
        });
      }
    }

    /* -------------------------------
       3️⃣ SLOT CHECK
    --------------------------------*/
    const slots = JSON.parse(fs.readFileSync(slotPath, "utf-8"));

    if (!slots[event] || slots[event] <= 0) {
      return res.status(400).json({
        success: false,
        message: "Slots full for this event"
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
      event,
      type,
      amount,
      team: finalTeam,
      teamDetails: teamMembers || [],  // store full team member details
      leaderName,
      email,
      phone,
      paymentId,
      checkedIn: false,
      time: new Date().toLocaleString()
    };

    registrations.push(newEntry);
    fs.writeFileSync(regPath, JSON.stringify(registrations, null, 2));

    /* -------------------------------
       6️⃣ DECREMENT SLOT
    --------------------------------*/
    slots[event] -= 1;
    fs.writeFileSync(slotPath, JSON.stringify(slots, null, 2));

    /* -------------------------------
       7️⃣ SEND EMAIL + SMS
    --------------------------------*/
    await sendEmail(email, leaderName, event, paymentId);
    await sendSMS(phone, event);

    res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
