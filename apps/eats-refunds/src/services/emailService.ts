import nodemailer from "nodemailer";

export async function sendCreditNoteEmail(email: string, pdfBuffer: Uint8Array) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "no-reply@molam.com",
    to: email,
    subject: "Votre note de crédit Molam Eats",
    text: "Veuillez trouver ci-joint votre note de crédit.",
    attachments: [{ filename: "credit-note.pdf", content: pdfBuffer }],
  });
}
