const express = require("express");

const controller = require("../controllers/auth.controller");
const router = express.Router();

router.get('/', controller.auth);

router.get('/login', controller.login);

router.post('/login', controller.postLogin);

router.get('/register', controller.register);

router.post("/register", controller.postRegister);

router.get('/forgot-password', controller.forgotpass);

router.post('/forgot-password', controller.postForgotpass);

router.get('/redirect', controller.redirect);

router.get('/welcome', controller.welcome);

module.exports = router;