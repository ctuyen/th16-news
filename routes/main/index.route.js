var express = require("express");
var db = require("../../utils/db");

var router = express.Router();

router.get("/", (req, res) => {
  var p = db.load("select * from posts");
  p.then(data => {
    
    var posts =  data.rows;

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
