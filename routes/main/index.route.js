var express = require("express");
var postmodel = require("../../models/posts.model");
var tagmodel = require("../../models/tags.model");

var router = express.Router();

router.get("/", (req, res, next) => {
  var cats = res.locals.lObjCategories;
  Promise.all([postmodel.topDate(10), postmodel.topView(10), tagmodel.all()])
    .then(([data, data1, data2]) => {
      var topView = data1.rows;
      var posts = data.rows;
      // console.log(data2);
      postmodel.topWithCat().then(d=>{
        console.log(d.rows);
      })

      var tags = data2.rows;
      // console.log(posts);
      res.render("main/index", {
        titlePage: "SaladNews - trang tin hàng đầu Việt Nam",
        stylePage: "main_styles",
        stylePageResponsive: "responsive",
        posts,
        categories: cats,
        topView,
        tags
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
