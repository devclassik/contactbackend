const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/BlackList");


const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
        // Check if the token is blacklisted
        const blacklistedToken = await Blacklist.findOne({ token });
        if (blacklistedToken) {
          return res.status(401).json({ message: "Token is blacklisted" });
        }
  
        // Attach the user information to the request
        req.user = decoded.user;
        next();
      } catch (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
    } else {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  });
  
  module.exports = validateToken;
