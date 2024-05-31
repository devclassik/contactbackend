const express = require("express");
const router = express();

const BlogRoute = require("./blog/blog");


router.use("/blog", BlogRoute);
// router.use("/search", search);

module.exports = router;
