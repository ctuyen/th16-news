const express = require('express')

const controller = require('../../controllers/writer/writer.controller')
const router = express.Router()

router.get('/', (req,res)=>{
    res.redirect('/writer/textEditor');
});
router.get('/textEditor', controller.textEditor);
router.post('/textEditor', controller.addPost);

router.get('/textEditor/:id', controller.loadEditPost);
router.post('/textEditor/update', controller.editPost);

router.get("/pending", controller.pending);

router.get("/denied", controller.denied);

router.get("/approved", controller.approved);

router.get("/published", controller.published);

module.exports = router

