import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chumair047@gmail.com', // Replace with your actual email
    pass: 'elvn txqy tglv ayna',    // Replace with your App Password
  },
});

// Make sure you have the word 'export' right here!
export const sendVerificationEmail = async (email, verifyUrl) => {
  await transporter.sendMail({
    from: '"ExpenseTracker" <no-reply@expensetracker.com>',
    to: email,
    subject: 'Verify your Account',
    html: `<p>Please verify your account by clicking the link below:</p>
           <a href="${verifyUrl}">Verify Email</a>`,
  });
};