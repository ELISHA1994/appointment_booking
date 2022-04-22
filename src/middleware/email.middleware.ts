import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  // service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVICE_USER,
    pass: process.env.EMAIL_SERVICE_PW,
  },
});

export const sendEmail = async (mailOptions: any) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.response}`);
  } catch (error) {
    console.log(error);
  }
};
