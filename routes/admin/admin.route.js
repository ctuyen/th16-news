const express = require("express");

const controller = require("../../controllers/admin/admin.controller");
const router = express.Router();

router.get("/", controller.admin);

router.get("/category", controller.category);
router.post("/category", controller.postCategory);
router.post("/category/:id/changeName", controller.changeCatName);
router.get("/category/:id/delete", controller.deleteCategory);

router.get("/post", (req, res) => {
  res.redirect("/admin/post/pending");
});
router.get("/post/pending", controller.pending);
router.get("/post/denied", controller.denied);
router.get("/post/approved", controller.approved);
router.get("/post/published", controller.published);
router.post("/post/public", controller.public);
router.get("/post/textEditor", controller.textEditor);
router.post("/post/textEditor", controller.addPost);
router.get('/post/textEditor/:id', controller.loadEditPost);
router.post('/post/textEditor/update', controller.editPost);
router.get('/post/delete/:id', controller.deletePost);

router.get("/tag", controller.tag);
router.post("/tag", controller.postTag);
router.post("/tag/:id/changeName", controller.changeTagName);
router.get("/tag/:id/delete", controller.deleteTag);

router.get("/user", controller.user);
router.post("/user", controller.postUser);
router.post("/user/:id/changePosition", controller.changePosition);
router.post("/user/:id/changeCategory", controller.changeCategory);
router.post("/user/:id/changePremiumDate", controller.changePremiumDate);
router.get("/user/:id/delete", controller.deleteUser);

module.exports = router;
