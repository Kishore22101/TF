const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

module.exports = async (data) => {
  const { name, email, event, paymentId } = data;

  const doc = new PDFDocument({ size: "A4" });
  const filePath = path.join(__dirname, `../tickets/${paymentId}.pdf`);

  if (!fs.existsSync("tickets")) {
    fs.mkdirSync("tickets");
  }

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(22).text("TECHFEST 2026", { align: "center" });
  doc.moveDown();

  doc.fontSize(16).text(`Name: ${name}`);
  doc.text(`Event: ${event}`);
  doc.text(`Payment ID: ${paymentId}`);
  doc.text(`Date: Feb 20–21, 2026`);
  doc.text(`Venue: JNN Institute of Engineering`);

  doc.moveDown();

  const qrData = `Name:${name}, Event:${event}, Payment:${paymentId}`;
  const qrImage = await QRCode.toDataURL(qrData);

  doc.image(qrImage, {
    fit: [150, 150],
    align: "center"
  });

  doc.end();

  return filePath;
};
