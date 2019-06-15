var postModel = require("../../models/posts.model");
var tagPostModel = require("../../models/tagPost.model");
module.exports = {
  textEditor: (req, res) => {
    res.render("writer/textEditor", {
      layout: "writer.hbs",
      titlePage: "Viết bài"
    });
  },

  pending: (req, res) => {
    var p = postModel.allWithStatus("draft");
    p.then(async data => {
      var posts = data.rows;
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
      res.render("writer/pending", {
        layout: "writer.hbs",
        titlePage: "Bài chưa duyệt",
        posts
      });
    }).catch(err => {
      console.log(err);
    });
  },

  denied: (req, res) => {
    var p = postModel.allWithStatus("deny");
    p.then(async data => {
      var posts = data.rows;
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
      res.render("writer/denied", {
        layout: "writer.hbs",
        titlePage: "Bài bị từ chối",
        posts
      });
    }).catch(err => {
      console.log(err);
    });
  },

  approved: (req, res) => {
    var p = postModel.allWithStatusTime(">");
    p.then(async data => {
      var posts = data.rows;
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
      res.render("writer/approved", {
        layout: "writer.hbs",
        titlePage: "Bài đã được duyệt & chờ xuất bản",
        posts
      });
    }).catch(err => {
      console.log(err);
    });
  },

  published: (req, res) => {
    var p = postModel.allWithStatusTime("<=");
    p.then(async data => {
      var posts = data.rows;
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
      res.render("writer/published", {
        layout: "writer.hbs",
        titlePage: "Bài đã xuất bản",
        posts
      });
    }).catch(err => {
      console.log(err);
    });
  },

  addPost: (req, res) => {
    var thumbnail = req.body.thumbnail;
    if (thumbnail == "") {
      thumbnail =
        "https://1080motion.com/wp-content/uploads/2018/06/NoImageFound.jpg.png";
    }
    var entity = {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      urlThumbnail: thumbnail,
      idWriter: req.signedCookies.userId,
      idCategory: parseInt(req.body.category)
    };
    var tagList = req.body.tag;
    postModel
      .add(entity)
      .then(async NewPost => {
        console.log("Đã thêm dòng bảng posts");
        if (Array.isArray(tagList)) {
          for (let i = 0; i < tagList.length; i++) {
            var entityTagPost = {
              idTag: parseInt(tagList[i]),
              idPost: NewPost.rows[0].id
            };
            await tagPostModel
              .add(entityTagPost)
              .then(data => {
                console.log("Đã thêm dòng bảng tagPost");
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
              console.log("Đã thêm dòng bảng tagPost");
            })
            .catch(err => {
              console.log(err);
            });
        }
        res.redirect("back");
      })
      .catch(err => {
        console.log(err);
      });
  },

  loadEditPost: (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.render("writer/editPost", {
        layout: "writer.hbs",
        titlePage: "Chỉnh sửa bài viết",
        err: true
      });
    }
    var p = postModel.single(id);
    p.then(data => {
      if (data.rows.length > 0) {
        for (const c of res.locals.lcCategories) {
          if (c.catid === +data.rows[0].idcategory) {
            c.isSelect = true;
          }
        }
        // for (const c of res.locals.lcTags) {
        //   if(c.catid === +data.rows[0].idcategory){
        //       c.isSelect = true;
        //   }
        // }
        res.render("writer/editPost", {
          layout: "writer.hbs",
          titlePage: "Chỉnh sửa bài viết",
          posts: data.rows[0],
          err: false
        });
      } else {
        res.render("writer/editPost", {
          layout: "writer.hbs",
          titlePage: "Chỉnh sửa bài viết",
          err: true
        });
      }
    }).catch(err => {
      console.log(err);
    });
  },

  editPost: async (req, res) => {
    var thumbnail = req.body.thumbnail;
    if (thumbnail == "") {
      thumbnail =
        "https://1080motion.com/wp-content/uploads/2018/06/NoImageFound.jpg.png";
    }
    var entity = {
      id: req.body.id,
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      urlThumbnail: thumbnail,
      status: "draft",
      idCategory: parseInt(req.body.category)
    };
    var tagList = req.body.tag;

    postModel
      .update(entity)
      .then(Post => {
        console.log("Đã sửa được bảng posts");
        
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
          console.log(err);
        });
    }
    res.redirect("/writer/pending");
  }
};
