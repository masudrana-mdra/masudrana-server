import nodemailer from 'nodemailer';

// Create a transporter using environment variables
export const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"Masud Rana Portfolio" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
