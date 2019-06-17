var express = require("express");
var postmodel = require("../../models/posts.model");

var router = express.Router();

router.get("/", (req, res, next) => {
  var cats = res.locals.lObjCategories;
  res.render("main/category", {
    titlePage: `SaladNews - category`,
    stylePage: "category",
    stylePageResponsive: "category_responsive",
    categories: cats
  });
});

router.get("/:idTag", (req, res) => {
  var cats = res.locals.lObjCategories;
  var idTag = req.params.idTag;
  var page = req.query.page || 1;
  page = page < 1 ? 1 : page;
  var limit = 3;
  var offset = (page - 1) * limit;
  var name;
  Promise.all([
    postmodel.pageByTag(idTag, offset, limit),
    postmodel.numByTag(idTag)
  ]).then(async ([data, data1]) => {
    var posts = data.rows;
    // console.log(posts);
    var count = data1.rows[0].total;
    // console.log("load rout       "+count)
    var numpage = Math.floor(count / limit);
    if (count % limit > 0) numpage++;
    var pages = [];

    var previousPage = { value: +page - 1 };
    var nextPage = { value: +page + 1 };
    if (page == 1 || numpage == 1) {
      previousPage.disabled = true;
    }
    if (page == numpage) {
      nextPage.disabled = true;
    }
    // console.log("trang truoc     " + previousPage.disabled);
    // console.log("trang sau       " + nextPage.disabled);

    for (let index = 0; index < numpage; index++) {
      let obj = { value: index + 1, active: false };
      if (obj.value == page) {
        obj.active = true;
      }
      pages.push(obj);
    }
    // console.log("sdfsdf tag:    "+idTag);
    for (var post of posts) {
      var t = await postmodel.loadTag(post.id);
      var temp = [];
      t.rows.forEach(i => {
        temp.push(i);
        // console.log(i.id);
        if (+idTag === +i.id) {
          name = i.name;
          // console.log(name);
        }
      });
      // console.log(temp);

      post.tags = temp;

      post.date = new Date(`${post.publicationdate}`).toLocaleDateString(
        "vi-VI",
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        },
        { timeZone: "Asia/Saigon" }
      );
    }
    res.render("main/category", {
      titlePage: `SaladNews - tag: `,
      stylePage: "category",
      stylePageResponsive: "category_responsive",
      categories: cats,
      posts,
      pages,
      previousPage,
      nextPage,
      nameT: name
    });
  });
});

module.exports = router;
