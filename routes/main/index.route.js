var express = require("express");
var postmodel = require("../../models/posts.model");

var router = express.Router();



router.get("/", (req, res) => {
  var cats = res.locals.lObjCategories;
  var p = postmodel.allwithLimit(5);
  p.then(data => {
    var posts = data.rows;
    // console.log(posts);
    res.render("main/index", {
      titlePage: "SaladNews - trang tin hàng đầu Việt Nam",
      stylePage: "main_styles",
      stylePageResponsive: "responsive",
      posts,
      categories: cats
    });
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router;
