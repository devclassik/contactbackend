const express = require("express");
const router = express();

const BlogRoute = require("./blog/blog");
const mailRoute = require("./mail/mail");


router.use("/blog", BlogRoute);
router.use("/mail", mailRoute);
// router.use("/search", search);

module.exports = router;
