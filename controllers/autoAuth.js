const userSchema = require("../models/userSchema");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

exports.login = async (req, res) => {
  try {
    const { email, name, image } = req.body;
    let checkUser = await userSchema.findOne({ email: email });
    if (!checkUser) {
      try {
        checkUser = await userSchema.create({
          email,
          password: generateStrongPassword(),
          avatar: image,
          name: name,
        });
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          success: false,
          err: err,
          message: "Error while creating user :(",
        });
      }
    }
    const payload = {
      userHandle: checkUser.userHandle,
      email: checkUser.email,
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
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      err: err,
      message: "Login failed",
    });
  }
};

function generateStrongPassword() {
  const length = 15;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";

  let password = "";
  for (let i = 0; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
