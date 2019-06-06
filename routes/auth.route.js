const express = require("express");

const controller = require("../controllers/auth.controller");
const router = express.Router();

router.get('/', controller.auth);

router.get('/login', controller.login);

router.post('/login', controller.postLogin);

module.exports = router;
