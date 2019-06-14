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
    p.then(data => {
      res.render("writer/pending", {
        layout: "writer.hbs",
        titlePage: "Bài chưa duyệt",
        posts: data.rows
      });
    }).catch(err => {
      console.log(err);
    });
  },

  denied: (req, res) => {
    var p = postModel.allWithStatus("deny");
    p.then(data => {
      res.render("writer/denied", {
        layout: "writer.hbs",
        titlePage: "Bài bị từ chối",
        posts: data.rows
      });
    }).catch(err => {
      console.log(err);
    });
  },

  approved: (req, res) => {
    var p = postModel.allWithStatusTime(">");
    p.then(data => {
      res.render("writer/approved", {
        layout: "writer.hbs",
        titlePage: "Bài đã được duyệt & chờ xuất bản",
        posts: data.rows
      });
    }).catch(err => {
      console.log(err);
    });
  },

  published: (req, res) => {
    var p = postModel.allWithStatusTime("<=");
    p.then(data => {
      res.render("writer/published", {
        layout: "writer.hbs",
        titlePage: "Bài đã xuất bản",
        posts: data.rows
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
      idWriter: 3,
      idCategory: parseInt(req.body.category)
    };
    var tagList = req.body.tag;
    postModel
      .add(entity)
      .then(async NewPost => {
        console.log("Đã thêm được bảng posts");
        for (let i = 0; i < tagList.length; i++) {
          var entityTagPost = {
            idTag: parseInt(tagList[i]),
            idPost: NewPost.rows[0].id
          };
          await tagPostModel.add(entityTagPost);
          console.log("Đã thêm được dòng tagPost");
        }
        res.render("writer/textEditor", {
          layout: "writer.hbs",
          titlePage: "Viết bài"
        });
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
    // const makeRequest = () =>
    //   getJSON().then(data => {
    //     console.log(data);
    //     return "done";
    //   });

    // const deleteTagPost = () => {
    //   let data = tagPostModel.delete(entity.id);
    //   console.log("Đã Xoá được dòng bảng tagPost");
    //   return "done";
    // };
    // await deleteTagPost();
    postModel
      .update(entity)
      .then(Post => {
        console.log("Đã sửa được bảng posts");
        res.redirect("/writer/pending");
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
  }
};
