
const nodemailer = require('nodemailer')
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SMTP_SENDER_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const sendMail = ( receiverGmail, parcelName ) => {

    let mailOptions = { 
        from: process.env.SMTP_SENDER_MAIL,
        to: receiverGmail,
        subject: `Your Parcel ${parcelName} has delivered ✔`, // Subject line
        text: "Thank You With for us", // plain text body
        // html: "<b>Hello world?</b>",
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error)console.log(error)
      else{console.log("Email Send Successfully")}
    })
  }

  module.exports = sendMail;