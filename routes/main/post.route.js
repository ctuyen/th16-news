var express = require("express");
var postmodel = require("../../models/posts.model");

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
router.get("/", (req, res, next) => {
  var cats = res.locals.lObjCategories;

  var p = postmodel.singleWithDetal(1);
  p.then(data => {
    var post = data.rows[0];
    post.urlthumbnail = post.urlthumbnail || "/images/no_image.png";

    var p1 = postmodel.loadTag(post.id);
    p1.then(data1 => {
      var tags = data1.rows;

      var p2 = postmodel.loadComment(post.id);
      p2.then(data2 => {
        var comments = data2.rows;
        // console.log(comments);
        // });
        res.render("main/post", {
          titlePage: `SaladNews - ${post.title}`,
          stylePage: "single",
          stylePageResponsive: "single_responsive",
          post,
          tags,
          comments,
          categories: cats
        });
      }).catch(err => {
        console.log(err);
        next;
      });
    }).catch(err => {
      console.log(err);
      next;
    });
  }).catch(err => {
    console.log(err);
    next;
  });
});

router.get("/:idPost", async (req, res) => {
  var cats = res.locals.lObjCategories;

  postmodel.addView(req.params.idPost);

  try {
    var data = await postmodel.singleWithDetal(req.params.idPost);

    var post = data.rows[0];

    post.urlthumbnail = post.urlthumbnail || "/images/no_image.png";
    post.date = new Date(`${post.publicationdate}`).toLocaleDateString(
      "vi-VI",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      },
      { timeZone: "Asia/Saigon" }
    );
    // console.log(post.idcategory);
    try {
      var [data1, data2, data3] = await Promise.all([
        postmodel.loadTag(post.id),
        postmodel.loadComment(post.id),
        postmodel.pageByCats(post.id,post.idcategory, 0, 5)
      ]);

      var tags = data1.rows;

      var comments = data2.rows;

      for (const c of comments) {
        c.date = new Date(`${post.commentdate}`).toLocaleDateString(
          "vi-VI",
          {
            day: "numeric",
            month: "short",
            year: "numeric"
          },
          { timeZone: "Asia/Saigon" }
        );
      }

      var postsCat = data3.rows;
      // console.log(postsCat);

      for (const p of postsCat) {
        p.date = new Date(`${post.publicationdate}`).toLocaleDateString(
          "vi-VI",
          {
            day: "numeric",
            month: "short",
            year: "numeric"
          },
          { timeZone: "Asia/Saigon" }
        );
      }
      res.render("main/post", {
        titlePage: `SaladNews - ${post.title}`,
        stylePage: "single",
        stylePageResponsive: "single_responsive",
        post,
        tags,
        comments,
        categories: cats,
        postsCat
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

module.exports = router;
