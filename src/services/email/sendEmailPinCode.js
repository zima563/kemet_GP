import nodemailer from "nodemailer";
import fs from "fs";

let emailTemplate = fs.readFileSync('./template.html', 'utf8');

export const sendEmailPcode = async (email, pinCode) => {
  // Replace placeholders with actual values
emailTemplate = emailTemplate.replace('{{userName}}', email);
emailTemplate = emailTemplate.replace('{{pincode}}', pinCode);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Kemet App" <${process.env.EMAIL_NAME}>`, // sender address
    to: email,
    subject: "Welcome to Kemet App, PIN CODE forgetting password", // list of receivers// Subject line
    html: emailTemplate, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
