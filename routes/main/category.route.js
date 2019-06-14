var express = require("express");
var postModel = require('../../models/posts.model')
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
  var idCat = req.params.idCat;
  var p = postModel.pageByCat(idCat,0 ,5);
  p.then(async data => {
    var posts = data.rows;

    for (var post of posts) {
      var t = await postModel.loadTag(post.id);
      var temp = [];
      t.rows.forEach(i => {
        temp.push(i);
      });
      // console.log(temp);

      post.tags = temp;

      post.date = new Date(`${post.writingdate}`).toLocaleDateString("vi-VI", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }
    res.render("main/category", {
      titlePage: `SaladNews - ${idCat}`,
      stylePage: "category",
      stylePageResponsive: "category_responsive",
      categories: cats,
      posts
    });
  }).catch(err => console.log(err));

  
});


module.exports = router;
