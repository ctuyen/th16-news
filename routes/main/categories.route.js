var express = require("express");

var router = express.Router();

router.get("/", (req, res) => {
  res.render("main/categories",{
      stylePage: 'category',
      stylePageResponsive: 'category_responsive'
  
  });
});

router.get("/:category", (req, res) => {
  var category = req.params.category;
  res.render("main/categories");
});

module.exports = router;
