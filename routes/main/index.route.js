var express = require("express");
var postmodel = require("../../models/post.model");

var router = express.Router();

router.get("/", (req, res) => {
  var p = postmodel.load();
  p.then(data => {
    
    var posts =  data.rows;
    // console.log(posts);
    res.render("main/index", {
      titlePage: "SaladNews - trang tin hàng đầu Việt Nam",
        stylePage: "main_styles",
        stylePageResponsive: "responsive",
        posts
      });
  }).catch(err => {
    console.log(err);
  });
  
});

module.exports = router;
