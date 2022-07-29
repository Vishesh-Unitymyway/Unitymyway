const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const signToken = (ID) => {
  return jwt.sign({ id: ID }, "This is my first website", {
    expiresIn: Date.now() + 90000,
  });
};

const createAndSendToken = (user, status, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    secure: true,
    httpOnly: false,
  });

  return res.status(status).json({
    message: "Success",
    user,
  });
};

exports.Createuser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(401).json({
        status: "FAIL",
        message: "Please fill in the field !",
      });
    }
    const newUser = await User.create(req.body);
    createAndSendToken(newUser, 400, res);
  } catch (err) {
    return res.status(401).json({
      status: "FAIL",
      message: err.message,
    });
  }
  next();
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        status: "FAIL",
        message: "Please provide email or password !",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "FAIL",
        message: "email or password is incorrect !",
      });
    }

    if (!(await user.comparePassword(user.password, password))) {
      return res.status(401).json({
        status: "FAIL",
        message: "email or password is incorrect !",
      });
    }

    return createAndSendToken(user, 400, res);
  } catch (err) {
    return res.status(401).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    let token;
    if (req.headers.jwt) {
      token = req.headers.jwt;
    }
  } catch (err) {
    return res.status(401).json({
      status: "FAIL",
      message: err.message,
    });
  }
};
