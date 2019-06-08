var express = require("express");
var postmodel = require("../../models/post.model");

var router = express.Router();

router.get("/", (req, res) => {
  res.render("main/post", {
    titlePage: "SaladNews - danh mục",
    stylePage: "category",
    stylePageResponsive: "category_responsive"
  });
});

// router.get("/", (req, res) => {
//   var p = postmodel.single(1);
//   p.then(data => {
//     var posts = data.rows;
//     console.log(posts);
//     res.render("main/single", {
//       titlePage: `SaladNews - post`,
//       stylePage: "single",
//       stylePageResponsive: "single_responsive"
//     });
//   }).catch(err => {
//     console.log(err);
//   });
// });

// router.get("/:idPost", (req, res) => {

//   var idPost = req.params.idPost;
//   var p = postmodel.single(idPost);
//   p.then(data => {
//     var post = data.rows[0];
//     res.render("main/single", {
//       titlePage: `SaladNews - ${idPost}`,
//       stylePage: "single",
//       stylePageResponsive: "single_responsive"
//     });
//   }).catch(err => {
//     console.log(err);
//   });
// });

module.exports = router;
