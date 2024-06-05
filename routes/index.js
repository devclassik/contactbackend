const express = require("express");
const router = express();

const BlogRoute = require("./blog/blog");
const mailRoute = require("./mail/mail");
const quizRoute = require("./quiz/quiz");


router.use("/blog", BlogRoute);
router.use("/mail", mailRoute);
router.use("/quiz", quizRoute);
// router.use("/search", search);

module.exports = router;
