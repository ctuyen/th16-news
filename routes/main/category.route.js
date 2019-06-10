var express = require("express");
var router = express.Router();


router.get("/", (req, res) => {
  var cats = res.locals.lObjCategories;
  res.render("main/category", {
    titlePage: `SaladNews - category`,
    stylePage: "category",
    stylePageResponsive: "category_responsive",
    categories: cats
  });
});
router.get("/:idCat", (req, res) => {
  var cats = res.locals.lObjCategories;
  var idCat = req.params.category;
  res.render("main/category", {
    titlePage: `SaladNews - ${idCat}`,
    stylePage: "category",
    stylePageResponsive: "category_responsive",
    categories: cats
  });
});



module.exports = router;
