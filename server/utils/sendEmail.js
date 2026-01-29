const nodemailer = require("nodemailer");
const generateTicket = require("./generateTicket");
const generateInvoice = require("./generateInvoice");

module.exports = async (email, name, event, paymentId) => {

  const ticketPath = await generateTicket({
    name,
    email,
    event,
    paymentId
  });

  const invoicePath = await generateInvoice({
    name,
    email,
    event,
    paymentId
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "techfest@gmail.com",
      pass: "APP_PASSWORD"
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "🎟 TechFest 2026 | Ticket & Invoice",
    html: `
      <h2>Hello ${name} 👋</h2>
      <p>Your registration for <b>${event}</b> is confirmed.</p>
      <p>Attached:</p>
      <ul>
        <li>🎫 Event Ticket (QR Code)</li>
        <li>🧾 Payment Invoice / Receipt</li>
      </ul>
      <p>Show ticket QR at entry.</p>
      <p>— TechFest Team</p>
    `,
    attachments: [
      {
        filename: "TechFest_Ticket.pdf",
        path: ticketPath
      },
      {
        filename: "TechFest_Invoice.pdf",
        path: invoicePath
      }
    ]
  });
};
