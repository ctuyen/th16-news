const express = require('express')

const controller = require('../../controllers/writer/writer.controller')
const router = express.Router()


router.get('/textEditor', controller.textEditor);

router.get("/pending", controller.pending);

router.get("/denied", controller.denied);

router.get("/approved", controller.approved);

router.get("/published", controller.published);

module.exports = router
