const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'bf9f185a47d448',
    pass: '022231cfaab552',
  },
});

module.exports = {
  confirm: async (email, hash) => {
    const info = await transporter.sendMail({
      to: email,
      subject: 'Confirm your email',
      text: `Please verify your email by visiting 
            https://**.herokuapp.com/api/users/confirm/${hash}/`,
      html: `<b> Please verify your email by clicking 
            <a href='https://**.herokuapp.com/api/users/confirm/${hash}/'>here</a>
            </b>`,
    });

    // eslint-disable-next-line no-console
    console.log('Message sent: %s', info.messageId);
  },
  recoverUserPassword: async (email, hash) => {
    // !!TODO
    const info = await transporter.sendMail({
      to: email,
      subject: 'Password Recovery',
      html: `
            <p>To reset your password, visit this   
            and then enter your new password ${hash}
            </p>
            `, // html body
    });

    // eslint-disable-next-line no-console
    console.log('Message sent: %s', info.messageId);
  },
};
