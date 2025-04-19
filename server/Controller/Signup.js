const bcrypt = require("bcryptjs");
const user = require("../Models/UserModel");

const SignupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "Fulfill every credentials",
      });
    }

    const checkUser = await user.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User with the given email already exists",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password length must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const User = new user({
      username,
      email,
      password: hashedPassword,
    });

    User.save();

    return res.status(200).json({
      success: true,
      message: "User registred successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = SignupUser;
