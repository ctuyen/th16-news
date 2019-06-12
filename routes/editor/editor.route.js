const express = require("express");
const controller = require("../../controllers/editor/editor.controller");
const router = express.Router();


router.get("/:id/posts", controller.list);
router.post('/accept', controller.acceptPost);
router.post('/deny', controller.denyPost);
module.exports = router;
