var postModel = require("../../models/posts.model");
var tagPostModel = require("../../models/tagPost.model");
var categoryModel = require("../../models/categories.model");
module.exports = {
  list: (req, res, next) => {
    var lcCat = res.locals.lcCategories;
    categoryModel
      .allCatOfEditor(req.signedCookies.userId)
      .then(data => {
        listIdCat = data.rows;
        for (const c of lcCat) {
          for (const cv of listIdCat) {
            if (c.catid === +cv.idcategory) {
              c.isView = true;
            }
          }
        }
        var id = req.params.id;
        var p = postModel.allByCat(id);
        p.then(async data => {
          var posts = data.rows;
          if (posts.length > 0) {
            // console.log(data);
            for (var post of posts) {
              var t = await postModel.loadTag(post.id);
              var temp = [];
              t.rows.forEach(i => {
                temp.push(i);
              });
              // console.log(temp);
              post.tags = temp;
              post.date = new Date(`${post.writingdate}`).toLocaleDateString(
                "vi-VI",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                },
                { timeZone: "Asia/Saigon" }
              );
            }
            for (const c of lcCat) {
              if (c.catid === +id) {
                c.isSelect = true;
              }
            }
            for (const c of lcCat) {
              if (c.catid === +id) {
                c.isActive = true;
              }
            }
          }
          res.render("editor/listPost", {
            posts,
            lcCat,
            titlePage: "Duyệt bài",
            layout: "editor.hbs"
          });
        }).catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        next(err);
      });
  },
  acceptPost: async (req, res, next) => {
    if (req.body.isPremium) {
      var isPremium = "true";
    } else {
      var isPremium = "false";
    }
    var entity = {
      id: req.body.id,
      idCategory: parseInt(req.body.category),
      isPremium,
      idEditor: req.signedCookies.userId,
      publicationDate: new Date(req.body.publicationDate).toLocaleString(
        "en-US",
        { timeZone: "UTC" }
      ),
      status: "accept"
    };
    // console.log(req.body.publicationDate);
    var tagList = req.body.tag;
    postModel
      .update(entity)
      .then(Post => {
        console.log("Đã chấp nhận bài viết");
        res.redirect("back");
      })
      .catch(err => {
        console.log(err);
      });
    await tagPostModel
      .delete(entity.id)
      .then(data => {
        console.log("Đã Xoá được dòng bảng tagPost");
      })
      .catch(err => {
        console.log(err);
      });
    if (Array.isArray(tagList)) {
      for (let i = 0; i < tagList.length; i++) {
        var entityTagPost = {
          idTag: parseInt(tagList[i]),
          idPost: entity.id
        };
        await tagPostModel
          .add(entityTagPost)
          .then(data => {
            console.log("Đã sửa được bảng tagPost");
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      var entityTagPost = {
        idTag: parseInt(tagList),
        idPost: entity.id
      };
      tagPostModel
        .add(entityTagPost)
        .then(data => {
          console.log("Đã sửa được bảng tagPost");
        })
        .catch(err => {
          next(err);
        });
    }
  },

  denyPost: (req, res, next) => {
    var entity = {
      id: req.body.id,
      reason: req.body.reason,
      status: "deny",
      idEditor: req.signedCookies.userId
    };
    // console.log(entity);
    postModel
      .update(entity)
      .then(Post => {
        console.log("Đã từ chối bài viết");
        res.redirect("back");
      })
      .catch(err => {
        next(err);
      });
  },

  listAccept: (req, res, next) => {
    var lcCat = res.locals.lcCategories;

    categoryModel
      .allCatOfEditor(req.signedCookies.userId)
      .then(data => {
        listIdCat = data.rows;
        // console.log(listIdCat);
        for (const c of lcCat) {
          c.isView = false;
          for (const cv of listIdCat) {
            if (c.catid === +cv.idcategory) {
              c.isView = true;
            }
          }
        }
        postModel
          .allByIdEditor(req.signedCookies.userId, "accept")
          .then(async data => {
            var posts = data.rows;
            if (posts.length > 0) {
              // console.log(data);
              for (var post of posts) {
                var t = await postModel.loadTag(post.id);
                var temp = [];
                t.rows.forEach(i => {
                  temp.push(i);
                });
                // console.log(temp);
                post.tags = temp;
                post.date = new Date(`${post.writingdate}`).toLocaleDateString(
                  "vi-VI",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  },
                  { timeZone: "Asia/Saigon" }
                );
              }
              res.render("editor/list", {
                posts,
                lcCat,
                isAccept: true,
                titlePage: "Bài đã duyệt",
                layout: "editor.hbs"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        next(err);
      });
  },
  listDeny: (req, res, next) => {
    var lcCat = res.locals.lcCategories;

    categoryModel
      .allCatOfEditor(req.signedCookies.userId)
      .then(data => {
        listIdCat = data.rows;
        for (const c of lcCat) {
          c.isView = false;
          for (const cv of listIdCat) {
            if (c.catid === +cv.idcategory) {
              c.isView = true;
            }
          }
        }
        postModel
          .allByIdEditor(req.signedCookies.userId, "deny")
          .then(async data => {
            var posts = data.rows;
            if (posts.length > 0) {
              // console.log(data);
              for (var post of posts) {
                var t = await postModel.loadTag(post.id);
                var temp = [];
                t.rows.forEach(i => {
                  temp.push(i);
                });
                // console.log(temp);
                post.tags = temp;
                post.date = new Date(`${post.writingdate}`).toLocaleDateString(
                  "vi-VI",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  },
                  { timeZone: "Asia/Saigon" }
                );
              }
            }
            res.render("editor/list", {
              posts,
              lcCat,
              isDeny: true,
              titlePage: "Bài đã duyệt",
              layout: "editor.hbs"
            });
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
