import nodemailer from "nodemailer";
import { generateEmailTemplatePinCode } from "./emailTemplate.js";

export const sendEmailPcode = async (userEmail, pinCode, subjectOfEmail) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  const info = await transporter.sendMail({
    from: `"Kemet App" <${process.env.EMAIL_NAME}>`, // sender address
    to: userEmail,
    subject: `PIN CODE > "${subjectOfEmail}"`, // list of receivers// Subject line
    html: generateEmailTemplatePinCode(userEmail, pinCode), // html body
  });

  console.log("Message sent: %s", info.messageId);
};
