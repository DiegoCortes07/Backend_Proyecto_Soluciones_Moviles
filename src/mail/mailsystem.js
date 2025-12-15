import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // IMPORTANTE
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});



export async function enviarCorreo(user, subject, html) {

  const info = await transporter.sendMail({
    from: {
        name: process.env.MAIL_FROM_NAME,
        address: process.env.MAIL_USER
    },
    to: user,
    subject: subject,
    html: html,
  });

  console.log("Correo enviado:", info.messageId);
}
export default enviarCorreo;