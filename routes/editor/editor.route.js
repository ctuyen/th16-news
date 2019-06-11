const express = require("express");
const controller = require("../../controllers/editor/editor.controller");
const router = express.Router();


router.get("/:id/posts", controller.list);

module.exports = router;
