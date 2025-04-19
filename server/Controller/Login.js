const bcrypt = require("bcryptjs");
const user = require("../Models/UserModel");
const jsonWebToken = require("jsonwebtoken");

const createToken = async (id) => {
  return jsonWebToken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Fulfill every credentials",
      });
    }

    const User = await user.findOne({ email });

    if (!User) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const checkPassword = await bcrypt.compare(password, User.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const jwtToken = await createToken(User._id);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = loginUser;
