import nodemailer from "nodemailer";
import { generateEmailTemplateOrder } from "./emailTemplate.js";

export const sendEmailOrderConfirm = async (userEmail, userName, orderCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"Kemet App" <${process.env.EMAIL_NAME}>`, // sender address
    to: userEmail,
    subject: "Order Confirmation", // list of receivers// Subject line
    html: generateEmailTemplateOrder(userName, orderCode), // html body
  });

  console.log("Message sent: %s", info.messageId);
};
