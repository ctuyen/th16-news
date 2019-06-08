const express = require('express')

const controller = require('../../controllers/admin/admin.controller')
const router = express.Router()

router.get('/', controller.admin)

router.get('/category', controller.category)

router.get("/post", controller.post);

router.get("/tag", controller.tag);

router.get("/user", controller.user);

module.exports = router
