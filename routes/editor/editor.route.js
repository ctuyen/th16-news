const express = require("express");
const controller = require("../../controllers/editor/editor.controller");
const router = express.Router();

router.get("/",(req, res) => {
    res.redirect("/editor/listAccept");
});
router.get("/:id/posts", controller.list);
router.get("/listAccept", controller.listAccept);
router.get("/listDeny", controller.listDeny);
router.post('/accept', controller.acceptPost);
router.post('/deny', controller.denyPost);
module.exports = router;
