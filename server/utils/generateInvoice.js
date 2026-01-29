const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = async ({ name, email, event, paymentId }) => {

  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
  }

  const filePath = path.join(invoiceDir, `Invoice_${paymentId}.pdf`);
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  /* HEADER */
  doc
    .fontSize(22)
    .text("TECHFEST 2026", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(14)
    .text("JNN Institute of Engineering", { align: "center" })
    .moveDown(1);

  doc
    .fontSize(18)
    .text("Payment Receipt / Invoice", { align: "center" })
    .moveDown(2);

  /* USER DETAILS */
  doc.fontSize(12);
  doc.text(`Invoice No: TF-${paymentId}`);
  doc.text(`Name: ${name}`);
  doc.text(`Email: ${email}`);
  doc.text(`Event: ${event}`);
  doc.text(`Payment ID: ${paymentId}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown(2);

  /* AMOUNT TABLE */
  const baseAmount = 150;
  const gst = (baseAmount * 18) / 100;
  const total = baseAmount + gst;

  doc.text(`Registration Fee: ₹${baseAmount.toFixed(2)}`);
  doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
  doc.text("-----------------------------");
  doc.fontSize(14).text(`Total Paid: ₹${total.toFixed(2)}`);

  doc.moveDown(3);

  /* FOOTER */
  doc
    .fontSize(10)
    .text(
      "This is a system-generated invoice. No signature required.\nFor queries: techfest@gmail.com",
      { align: "center" }
    );

  doc.end();

  return filePath;
};
