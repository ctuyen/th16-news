const express = require('express')

const controller = require('../../controllers/admin/admin.controller')
const router = express.Router()

router.get('/', controller.admin)

router.get('/category', controller.category)

router.post('/category/:id/changeName', controller.changeCatName)

router.get("/post", controller.post);

router.get("/post/:id/public", controller.public);

router.get("/tag", controller.tag);

router.post('/tag/:id/changeName', controller.changeTagName)

router.get("/user", controller.user);

router.post('/category', controller.postCategory);

router.post('/tag', controller.postTag);

router.post('/user', controller.postUser);

router.post('/post', controller.postPost);

module.exports = router