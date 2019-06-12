const express = require('express')

const controller = require('../../controllers/admin/admin.controller')
const router = express.Router()

router.get('/', controller.admin)

router.get('/category', controller.category)

router.get("/post", controller.post);

router.get("/tag", controller.tag);

router.get("/user", controller.user);

router.post('/category', controller.postCategory);

router.post('/tag', controller.postTag);

router.post('/user', controller.postUser);

router.post('/post', controller.postPost);

module.exports = router