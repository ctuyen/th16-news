var express = require("express");
var postmodel = require("../../models/posts.model");
var authMiddleware = require('../../middlewares/auth.middleware')
var userModel = require('../../models/users.model')
var authModel = require('../../models/auth.model')

var router = express.Router();

router.get("/", (req, res) => {
  var cats = res.locals.lObjCategories;
  var p = postmodel.all();
  p.then(data => {
    var posts = data.rows;
    // console.log(posts);
    res.render("main/index", {
      titlePage: "SaladNews - trang tin hàng đầu Việt Nam",
      stylePage: "main_styles",
      stylePageResponsive: "responsive",
      posts,
      categories: cats
    });
  }).catch(err => {
    console.log(err);
  });
});

router.get('/request-premium', authMiddleware.requireAuth, (req, res) => {
  res.render('main/request-premium', {
    layout: false
  })
});

router.post('/request-premium', (req, res) => {
  //tim xem user co trong db hay khong
  var checkId = authModel.checkId(req.signedCookies.userId);

  checkId.then(user => {
    let entity = {}
    entity.id = user.rows[0].id;
    if (!user.rows[0].expirationdate) {
      let date = new Date()
      date.setTime(Date.now() + 604800000)
      entity.expirationdate = date
      entity.fullname = 'chua co expire'
    } else {
      let date = new Date(user.rows[0].expirationdate)
      date.setTime(date.valueOf() + 604800000)
      entity.expirationdate = date // 7 ngay
      entity.fullname = 'da co expire'
    }

    userModel.update(entity)
      .then(data => {
        res.render('main/request-premium', {
          layout: false,
          notices: 'Bạn đã gia hạn thêm 7 ngày premium thành công!'
        })
      })
      .catch(err => {
        throw err
      })
  })
})

module.exports = router;