var express = require("express");
var postmodel = require("../../models/posts.model");
var authMiddleware = require("../../middlewares/auth.middleware");
var userModel = require("../../models/users.model");
var tagmodel = require("../../models/tags.model");
var authModel = require("../../models/auth.model");

var router = express.Router();

router.get("/", (req, res, next) => {
  var cats = res.locals.lObjCategories;
  Promise.all([
      postmodel.topDate(10),
      postmodel.topView(10),
      tagmodel.all(),
      postmodel.topWithCat(10)
    ])
    .then(([data, data1, data2, data3]) => {
      var topView = data1.rows;
      var posts = data.rows;
      // console.log(data2);
      // postmodel.topWithCat(10).then(d=>{
      //   console.log(d.rows);
      // })
      var topCat = data3.rows;
      var tags = data2.rows;
      // console.log(posts);
      res.render("main/index", {
        titlePage: "SaladNews - trang tin hàng đầu Việt Nam",
        stylePage: "main_styles",
        stylePageResponsive: "responsive",
        posts,
        categories: cats,
        topView,
        topCat,
        tags
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.get("/request-premium", authMiddleware.requireAuth, (req, res) => {
  res.render("main/request-premium", {
    layout: false
  });
});

router.post("/request-premium", (req, res) => {
  //tim xem user co trong db hay khong
  var checkId = authModel.checkId(req.signedCookies.userId);

  checkId.then(user => {
    let entity = {};
    entity.id = user.rows[0].id;
    if (!user.rows[0].expirationdate) {
      let date = new Date();
      date.setTime(Date.now() + 604800000);
      entity.expirationdate = date;
    } else {
      let date = new Date(user.rows[0].expirationdate);
      date.setTime(date.valueOf() + 604800000);
      entity.expirationdate = date; // 7 ngay
      entity.fullname = "da co expire";
    }

    userModel
      .update(entity)
      .then(data => {
        res.render("main/request-premium", {
          layout: false,
          notices: "Bạn đã gia hạn thêm 7 ngày premium thành công!"
        });
      })
      .catch(err => {
        throw err;
      });
  });
});

router.get('/login', (req, res) => {
  res.redirect('/auth/login')
})

router.get('/signup', (req, res) => {
  res.redirect('/auth/register')
})

module.exports = router;