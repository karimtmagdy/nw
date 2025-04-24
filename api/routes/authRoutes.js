const express = require("express");
const router = express.Router();

const { login } = require("../services/auth.service");
const { validateLogin } = require("../validator/auth.validate");

router.post("/sign-in", validateLogin, login);

module.exports = router;
