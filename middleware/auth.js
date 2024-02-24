const jwt = require("jsonwebtoken");
require("dotenv").config();
// middleware authentication
exports.auth = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Please login first",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "invalid token",
        error: err,
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "User is not authorized",
      error: err,
    });
  }
};