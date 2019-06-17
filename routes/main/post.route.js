var express = require("express");
var postmodel = require("../../models/posts.model");
var userModel = require("../../models/users.model")

var router = express.Router();

// router.get("/", (req, res) => {
//   var cats = res.locals.lObjCategories;

//   var p = postmodel.singleWithDetal(1);
//   p.then(data => {
//     var post = data.rows[0];
//     console.log(post);
//     res.end("hum");
//   }).catch(err => {
//     console.log(err);
//   })
// });
router.get("/", async (req, res, next) => {
  res.redirect('/posts/2')
});

router.get("/:idPost", async (req, res) => {
  var user = userModel.single(req.signedCookies.userId)
  user
    .then(async user => {
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
        // console.log(post.idcategory);
        try {
          var [data1, data2, data3] = await Promise.all([
            postmodel.loadTag(post.id),
            postmodel.loadComment(post.id),
            postmodel.pageByCats(post.id, post.idcategory, 0, 5)
          ]);

          var tags = data1.rows;

          var comments = data2.rows;

          for (const c of comments) {
            c.date = new Date(c.commentdate).toLocaleString(
              "vi-VN", {
                timeZone: "Asia/Saigon"
              }
            );
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
            user
          });
        } catch (error) {
          console.log(error);
          throw error;
        }
      } catch (error) {
        console.log(error);
        throw error;
      }

    })
    .catch(err => {
      throw err
    })
});
router.post("/:idpost", (req, res, next) => {
  var entity = {
    idpost: req.params.idpost,
    iduser: req.signedCookies.userId,
    content: req.body.content,
    commentDate: new Date().toLocaleString(
      "en-US", {
        timeZone: "UTC"
      }
    )
  };
  postmodel.addComment(entity).then(() => {
    res.redirect("back");
  }).catch(err => {
    next(err);
  });
});

module.exports = router;