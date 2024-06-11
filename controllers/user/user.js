const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Blacklist = require("../../models/BlackList");
const helper = require("../../utilities/helpers");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Log = require("../../models/Log");

//@desc Register a user
//@route POST /api/register
//@access public
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return helper.controllerResult({
        req,
        res,
        statusCode: 400,
        message: "All fields are require",
      });
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return helper.controllerResult({
        req,
        res,
        result: userAvailable,
        statusCode: 400,
        message: "User already exist",
      });
    }

    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    console.log(`user craeted successfully ${user}`);
    // Create a log entry for the login
    await Log.create({ userId: user._id, loginTime: new Date() });

    if (user) {
      return helper.controllerResult({
        req,
        res,
        statusCode: 201,
        result: user,
        message: "Login successful",
      });
    } else {
      return helper.controllerResult({
        req,
        res,
        statusCode: 400,
        message: "User data not valid",
      });
    }
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: error,
      message: error.message,
    });
  }
};

//@desc Login a user
//@route POST /api/login
//@access public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate email and password fields
    if (!email || !password) {
      return helper.controllerResult({
        req,
        res,
        statusCode: 400,
        message: "All fields are required",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return helper.controllerResult({
        req,
        res,
        statusCode: 401,
        message: "Email and/or password is not valid",
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return helper.controllerResult({
        req,
        res,
        statusCode: 401,
        message: "Email and/or password is not valid",
      });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id, // Use _id instead of id
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Create a log entry for the login
    await Log.create({ userId: user._id, loginTime: new Date() });

    return helper.controllerResult({
      req,
      res,
      result: { accessToken, user },
      message: "Login successful",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: error,
      message: error.message,
    });
  }
};

//@desc Current user
//@route POST /api/current
//@access private
exports.currentUser = async (req, res) => {
  try {
    return helper.controllerResult({
      req,
      res,
      result: req.user,
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: error,
      message: error.message,
    });
  }
  //   res.json(req.user);
};

exports.updateUser = async (req, res) => {
  try {
    const dataToSend = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dataToSend) {
      return helper.controllerResult({
        req,
        res,
        result: erroMsg,
        statusCode: 404,
      });
    }
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "updated successfully",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      result: error,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return helper.controllerResult({
        req,
        res,
        statusCode: 400,
        message: { message: "User not found" },
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process:\n\n
               http://${req.headers.host}/api/v1/user/reset-password/${resetToken}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // console.log('reset token', resetToken);
    await transporter.sendMail(mailOptions);
    return helper.controllerResult({
      req,
      res,
      message: { message: "Password reset email sent" },
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 500,
      result: error,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    // Update password and clear reset token fields
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return helper.controllerResult({
      req,
      res,
      message: { message: "Password has been updated" },
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 500,
      result: error,
      message: error.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);

    // Store the token in the blacklist
    await Blacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });
    // Create a log entry for the login
    const log = await Log.findOne({ userId: decoded.user.id }).sort({
      createdAt: -1,
    });
    if (log && !log.logoutTime) {
      log.logoutTime = new Date();
      await log.save();
    }
    return helper.controllerResult({
      req,
      res,
      message: "Logout successful",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 500,
      result: error,
      message: "Logout failed",
    });
  }
};
