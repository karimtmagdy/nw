const express = require("express");
const router = express.Router();

const { login, register, logout } = require("../services/auth.service");
const {
  validateLogin,
  validateRegister,
} = require("../validator/auth.validate");

router.post("/sign-up", validateRegister, register);
router.post("/sign-in", validateLogin, login);
router.post("/sign-out", logout);

module.exports = router;
