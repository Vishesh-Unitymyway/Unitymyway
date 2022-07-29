const express = require("express");
const authController = require("../Controllers/authController");
const Router = express.Router();

Router.post("/Signup", authController.Createuser);
Router.post("/login", authController.login);

module.exports = Router;
