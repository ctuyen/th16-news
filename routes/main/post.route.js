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

router.get("/:idPost", (req, res) => {
  var cats = res.locals.lObjCategories;

  postmodel.addView(req.params.idPost);

  var p = postmodel.singleWithDetal(req.params.idPost);
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

module.exports = router;
