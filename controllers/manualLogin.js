const userSchema = require("../models/userSchema");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

exports.manualLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userSchema.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    
    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const payload = {
      email: user.email,
      name: user.name,
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "168h",
    });
    checkUser = checkUser.toObject();
    checkUser.token = token;
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token: token,
      user: checkUser,
      message: "Logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, name } = req.body;
  try {

    let user = await userSchema.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = await userSchema.create({
      email,
      password,
      name,
    });

    user.password = null;
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
