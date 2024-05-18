const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "alomajaopemipo8@gmail.com",
    pass: "qasw qjhi yiol fbmy",
  },
});

const sendMailer = asyncHandler(async (req, res) => {
  // console.error('data 1',req.body);

  const mailOptions = {
    from: req.body.email,
    to: req.body.to,
    subject: req.body.subject,
    html: req.body.message,
  };

  // console.error('data',mailOptions);
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.log('error 1', error);

      return res.status(500).send(error);
    }
    // console.log('success', info);

    res.status(200).json({msg:info}).send("Email sent successfully");
  });
});


module.exports = { sendMailer };