var express = require("express");
var postmodel = require("../../models/posts.model");
var userModel = require("../../models/users.model");
var postMiddleware = require('../../middlewares/post.middleware');

var router = express.Router();

router.get("/", async (req, res, next) => {
  res.redirect("/posts/2");
});

router.get("/:idPost", postMiddleware.checkPremium, async (req, res) => {
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
  postmodel.addView(req.params.idPost);

  try {
    var data = await postmodel.singleWithDetal(req.params.idPost);

    var post = data.rows[0];

    post.urlthumbnail = post.urlthumbnail || "/images/no_image.png";
    post.date = new Date(`${post.publicationdate}`).toLocaleDateString(
      "vi-VI", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }, {
        timeZone: "Asia/Saigon"
      }
    );

    try {
      var [data1, data2, data3, ispremium] = await Promise.all([
        postmodel.loadTag(post.id),
        postmodel.loadComment(post.id),
        postmodel.pageByCats(post.id, post.idcategory, 0, 5),
        postmodel.checkPremium(req.params.idPost)
      ]);

      var tags = data1.rows;

      var comments = data2.rows;
      var ispremium = ispremium.rows[0].ispremium;

      for (const c of comments) {
        c.date = new Date(c.commentdate).toLocaleString("vi-VN", {
          timeZone: "Asia/Saigon"
        });
      }

      var postsCat = data3.rows;
      // console.log(postsCat);

      for (const p of postsCat) {
        p.date = new Date(`${post.publicationdate}`).toLocaleDateString(
          "vi-VI", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }, {
            timeZone: "Asia/Saigon"
          }
        );
      }
      if (req.signedCookies.userId) {
        var isLogin = true;
      } else {
        var isLogin = false;
      }

      res.render("main/post", {
        titlePage: `SaladNews - ${post.title}`,
        stylePage: "single",
        stylePageResponsive: "single_responsive",
        post,
        tags,
        comments,
        categories: cats,
        postsCat,
        isLogin,
        user,
        ispremium
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
});

router.post("/:idpost", (req, res, next) => {
  var entity = {
    idpost: req.params.idpost,
    iduser: req.signedCookies.userId,
    content: req.body.content,
    commentDate: new Date().toLocaleString("en-US", {
      timeZone: "UTC"
    })
  };
  postmodel
    .addComment(entity)
    .then(() => {
      res.redirect("back");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;