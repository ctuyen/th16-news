var express = require("express");
var postmodel = require("../../models/posts.model");
var userModel = require("../../models/users.model")
var router = express.Router();

router.post("/", async (req, res) => {
  var user;
  if (req.signedCookies.userId) {
    userModel
      .single(req.signedCookies.userId)
      .then(data => {
        if (data.rowCount > 0) {
          user = data.rows[0];
          if (user.position == "admin") {
            user.admin = true;
          }
          if (user.position == "writer") {
            user.writer = true;
          }
          if (user.position == "editor") {
            user.editor = true;
          }
        } else {
          user = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  var cats = res.locals.lObjCategories;
  var key = req.body.q;
  var check = true;
  var posts;
  if (key) {
    var p = await postmodel.searchPosts(key);
    posts = p.rows;
    if (posts.length < 1) {
      check = false;
    }
  } else {
    check = false;
  }
  // res.render("main/search.model", {});
  postmodel.searchPosts(key);
  console.log(key);
  console.log("tới search r");
  res.render("main/search", {
    titlePage: `SaladNews - Tìm kiếm "${key}"`,
    stylePage: "category",
    stylePageResponsive: "category_responsive",
    categories: cats,
    posts,
    check,
    user,
    key
  });
});

module.exports = router;