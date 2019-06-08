var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.render("main/category", {
    titlePage: `SaladNews - category`,
    stylePage: "category",
    stylePageResponsive: "category_responsive"
  });
});
router.get("/:idCat", (req, res) => {
  var idCat = req.params.category;
  res.render("main/category", {
    titlePage: `SaladNews - ${idCat}`,
    stylePage: "category",
    stylePageResponsive: "category_responsive"
  });
});



module.exports = router;
