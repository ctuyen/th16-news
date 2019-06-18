var express = require("express");
var postmodel = require("../../models/posts.model");
var authMiddleware = require("../../middlewares/auth.middleware");
var userModel = require("../../models/users.model");
var tagmodel = require("../../models/tags.model");
var authModel = require("../../models/auth.model");

var router = express.Router();

router.get("/", (req, res) => {
  var cats = res.locals.lObjCategories;
  var tasks = [
    postmodel.topDate(10),
    postmodel.topView(10),
    tagmodel.all(),
    postmodel.topWithCat(10)
  ];

  if (req.signedCookies.userId) {
    tasks.push(userModel.single(req.signedCookies.userId));
  } else {
    tasks.push(Promise.resolve(false));
  }

  Promise.all(tasks)
    .then(async ([data, data1, data2, data3, user]) => {
      var topView = data1.rows;
      var posts = data.rows;
      var topCat = data3.rows;
      var tags = data2.rows;
      var data4 = await postmodel.topSlide();
      var data5 = await postmodel.load3pre();
      var topslide = data4.rows;
      var l3Pre = data5.rows;

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

      //top view
      topView.forEach((e, key) => {
        e.index = key + 1;
      });

      for (const post of posts) {
        post.date = new Date(`${post.publicationdate}`).toLocaleDateString(
          "vi-VI", {
            timeZone: "Asia/Saigon"
          }
        );
      }
      for (const p of l3Pre) {
        p.date = new Date(`${p.publicationdate}`).toLocaleDateString(
          "vi-VI", {
            timeZone: "Asia/Saigon"
          }
        );
      }

      res.render("main/index", {
        titlePage: "SaladNews - trang tin hàng đầu Việt Nam",
        stylePage: "main_styles",
        stylePageResponsive: "responsive",
        posts,
        categories: cats,
        topView,
        topCat,
        tags,
        user,
        topslide,
        l3Pre
      });
    })
    .catch(err => {
      throw err;
    });
});

router.get("/request-premium", authMiddleware.requireAuth, (req, res) => {
  res.render("main/request-premium", {
    layout: false
  });
});

router.post("/request-premium", (req, res) => {
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
      let dateNow = new Date();

      if (dateNow.valueOf() < date.valueOf()) {
        date.setTime(date.valueOf() + 604800000);
      } else {
        date.setTime(dateNow.valueOf() + 604800000);
      }

      entity.expirationdate = date;
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

router.get("/login", (req, res) => {
  res.redirect("/auth/login");
});

router.get("/signup", (req, res) => {
  res.redirect("/auth/register");
});

router.get("/personal", authMiddleware.requireAuth, (req, res) => {
  userModel.single(req.signedCookies.userId)
    .then(users => {
      let user = users.rows[0];
      if (!user.urlavatar) {
        user.urlavatar =
          "https://res.cloudinary.com/ctuyen/image/upload/v1560189834/th16-news/Avatar_Pig-512.png";
      }

      res.render("main/personal", {
        layout: false,
        user
      });
    })
    .catch(err => {
      throw err;
    });
});

router.post("/personal", (req, res) => {
  let entity = {};
  entity.id = req.signedCookies.userId;
  entity.fullname = req.body.fullname;
  entity.email = req.body.email;
  entity.urlavatar = req.body.urlavatar;

  userModel.update(entity)
    .then(
      users => {
        let user = users.rows[0];
        if (!user.urlavatar) {
          user.urlavatar =
            "https://res.cloudinary.com/ctuyen/image/upload/v1560189834/th16-news/Avatar_Pig-512.png";
        }
        console.log(user)
        res.render("main/personal", {
          layout: false,
          user,
          notices: "Chúc mừng. Bạn đã đổi thông tin thành công!"
        });
      }
    )
    .catch(err => {
      throw err;
    });
});

module.exports = router;