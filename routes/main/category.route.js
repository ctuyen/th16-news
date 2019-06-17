var express = require("express");
var postModel = require("../../models/posts.model");
var userModel = require("../../models/users.model")
var router = express.Router();


router.get("/", async (req, res, next) => {
  res.redirect('/categories/1')
});


router.get("/:idCat", (req, res, next) => {
  var user = userModel.single(req.signedCookies.userId)
  user
    .then(user => {
      //have user
      if (user.rowCount > 0) {
        user = user.rows[0]
        if (user.position == 'admin') {
          user.admin = true
        }
        if (user.position == 'writer') {
          user.writer = true
        }
        if (user.position == 'editor') {
          user.editor = true
        }
      } else {
        user = false
      }

      var cats = res.locals.lObjCategories;
      var idCat = req.params.idCat;
      var cate = res.locals.lcCategories.find(c => {
        return c.catid == idCat;
      });
      // console.log(res.locals.lcCategories);
      var page = req.query.page || 1;
      page = page < 1 ? 1 : page;
      var limit = 3;
      var offset = (page - 1) * limit;
      // console.log("before     OMG");
      Promise.all([
          postModel.pageByCat(idCat, offset, limit),
          postModel.numByCat(idCat)
        ])
        .then(async ([data, data1]) => {
          var posts = data.rows;
          // console.log(posts);
          var count = data1.rows[0].total;
          // console.log("load rout       "+count)
          var numpage = Math.floor(count / limit);
          if (count % limit > 0) numpage++;
          var pages = [];

          var previousPage = {
            value: +page - 1
          };
          var nextPage = {
            value: +page + 1
          };
          if (page == 1 || numpage == 1) {
            previousPage.disabled = true;
          }
          if (page == numpage) {
            nextPage.disabled = true;
          }
          // console.log("trang truoc     " + previousPage.disabled);
          // console.log("trang sau       " + nextPage.disabled);

          for (let index = 0; index < numpage; index++) {
            let obj = {
              value: index + 1,
              active: false
            };
            if (obj.value == page) {
              obj.active = true;
            }
            pages.push(obj);
          }

          for (var post of posts) {
            var t = await postModel.loadTag(post.id);
            var temp = [];
            t.rows.forEach(i => {
              temp.push(i);
            });
            // console.log(temp);

            post.tags = temp;

            post.date = new Date(`${post.publicationdate}`).toLocaleDateString(
              "vi-VI", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }, {
                timeZone: "Asia/Saigon"
              }
            );
          }
          res.render("main/category", {
            titlePage: `SaladNews - ${idCat}`,
            stylePage: "category",
            stylePageResponsive: "category_responsive",
            categories: cats,
            posts,
            pages,
            previousPage,
            nextPage,
            nameT: cate.name,
            user
          });
        })
        .catch(next);
    })
    .catch(err => {
      throw err
    })
});

module.exports = router;