const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const helper = require("../../utilities/helpers");


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "alomajaopemipo8@gmail.com",
    pass: "qasw qjhi yiol fbmy",
  },
});

const sendMailer = asyncHandler(async (req, res) => {
  // console.log('body', req.body);
  const { name, email, to, subject, message } = req.body;

  // Create the email body for the recipient
  const recipientMailBody = `
    <p>Hello ${to},</p>
    <p>You have received a message from ${name} (${email}):</p>
    <p>${message}</p>
    <p>Regards,</p>
    <p>${name}</p>
  `;

  // Create the email body for the sender
  const senderMailBody = `
    <p>Hello ${name},</p>
    <p>You have sent the following message to ${to} (${email}):</p>
    <p>${message}</p>
    <p>Kindly wait for response</p>
    <p>Regards,</p>
    <p>Opemipo Alomaja</p>
  `;

  // Mail options for the recipient
  const recipientMailOptions = {
    from: email,
    to: to, // Allow any email address to receive the message
    subject: subject,
    html: recipientMailBody,
  };

  // Mail options for the sender
  const senderMailOptions = {
    from: email,
    to: email, // Send a copy to the sender
    subject: subject,
    html: senderMailBody,
  };

  try {
    // Send email to the recipient
    await transporter.sendMail(recipientMailOptions);

    // Send email to the sender
    await transporter.sendMail(senderMailOptions);

    return helper.controllerResult({
      req,
      res,
      message: { message: "Password reset email sent" },
    });
    // Respond with success message
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 500,
      result:  error,
      message: error.message,
    });
    // Handle any errors
  }
  

  // // Send email to the recipient
  // await transporter.sendMail(recipientMailOptions, (error, info) => {
  //   if (error) {
  //     return res.status(500).send(error);
  //   }
  // });

  // // Send email to the sender
  // await transporter.sendMail(senderMailOptions, (error, info) => {
  //   if (error) {
  //     return res.status(500).send(error);
  //   }
  //   res.status(200).json({ msg: info }).send("Email sent successfully");
  // });
});

module.exports = { sendMailer };
