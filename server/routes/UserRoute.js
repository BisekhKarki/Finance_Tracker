const express = require("express");
const loginUser = require("../Controller/Login");
const SignupUser = require("../Controller/Signup");
const router = express.Router();

router.post("/login", loginUser);
router.post("/Signup", SignupUser);

module.exports = router;
