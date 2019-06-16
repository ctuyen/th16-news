const bcrypt = require("bcrypt");
const saltRounds = 10;

var categoryModel = require("../../models/categories.model");
var tagModel = require("../../models/tags.model");
var postModel = require("../../models/posts.model");
var userModel = require("../../models/users.model");
var editorModel = require("../../models/editor.model");
var tagPostModel = require("../../models/tagPost.model");


module.exports = {
  admin: (req, res) => {
    res.redirect("/admin/category");
  },

  category: async (req, res) => {
    var fatherCate = await categoryModel.loadFather();
    var fatherCates = fatherCate.rows;

    var categories = categoryModel.all();

    categories
      .then(data => {
        res.render("admin/category", {
          title: "Quản lí chuyên mục | Salad News",
          layout: "admin.hbs",
          categories: data.rows,
          fatherCates
        });
      })
      .catch(err => {
        throw err;
      });
  },

  user: async (req, res) => {
    // staffs, cate of editor, all users
    var data = {};

    var staffs = await userModel.allStaff();
    var users = await userModel.allUser();
    var editers = await userModel.allEditer();
    var categories = await categoryModel.all();

    if (staffs.rowCount > 0) {
      data.staffs = staffs.rows;
    }

    if (users.rowCount > 0) {
      data.users = users.rows;
      let expirationdate = [];

      for (let [index, user] of data.users.entries()) {
        if (user.expirationdate) {
          let date = new Date(user.expirationdate).toLocaleString("vi-VI",{ timeZone: "Asia/Saigon" });
          // date.setTime(date.valueOf());
          data.users[index].expirationdate = date;
        } else {
          data.users[index].expirationdate = "Chưa gia hạn";
        }
      }
    }

    data.editers = [];

    for (let [index, editer] of editers.rows.entries()) {
      let editerRender = {};
      editerRender.fullname = editer.fullname;
      editerRender.email = editer.email;
      editerRender.id = editer.id;

      let idCategory = await userModel.catesOfEditer(editer.id);
      let category = [];

      if (idCategory.rowCount > 0) {
        for (id of idCategory.rows) {
          let cate = await categoryModel.single(id.idcategory);
          category.push(cate.rows[0].name);
        }
      }

      editerRender.category = category;
      data.editers.push(editerRender);
    }

    if (categories.rowCount > 0) {
      let categoriesRender = [];
      for (cate of categories.rows) {
        categoriesRender.push({
          id: cate.id,
          name: cate.name
        });
      }

      data.categories = categoriesRender;
    }

    res.render("admin/user", {
      title: "Quản lí người dùng | Salad News",
      layout: "admin.hbs",
      data
    });
  },

  tag: (req, res) => {
    var tags = tagModel.all();

    tags
      .then(data => {
        res.render("admin/tag", {
          title: "Quản lí thẻ | Salad News",
          layout: "admin.hbs",
          tags: data.rows
        });
      })
      .catch(err => {
        throw err;
      });
  },

  post: (req, res, next) => {
    var p = postModel.allWithDetails();
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
          {
            timeZone: "Asia/Saigon"
          }
        );
      }
      res.render("admin/post", {
        title: "Quản lí bài đăng | Salad News",
        layout: "admin.hbs",
        posts
      });
    }).catch(err => next(err));
  },

  postCategory: (req, res) => {
    if (req.body.tagname === "") {
      res.redirect("/admin/category");
      return;
    }

    let entity = {};
    entity.name = req.body.tagname;
    if (req.body.parent != "0") {
      entity.idCategory = req.body.parent;
    }

    categoryModel
      .add(entity)
      .then(res.redirect("/admin/category"))
      .catch(err => {
        throw err;
      });
  },

  postTag: (req, res) => {
    let entity = {};
    entity.name = req.body.tagname;
    tagModel
      .add(entity)
      .then(res.redirect("/admin/tag"))
      .catch(err => {
        throw err;
      });
  },

  postUser: (req, res) => {
    let entity = {};
    entity.fullname = req.body.name;
    entity.email = req.body.email;
    entity.position = req.body.position;
    entity.password = bcrypt.hashSync(req.body.password, saltRounds);

    userModel
      .add(entity)
      .then(res.redirect("user"))
      .catch(err => {
        throw err;
      });
  },

  postPost: (req, res) => {},

  public: (req, res, next) => {
    if (req.body.isPremium) {
      var isPremium = "true";
    } else {
      var isPremium = "false";
    }
    var entity = {
      id: req.body.id,
      status: "accept",
      isPremium,
      idEditor: req.signedCookies.userId,
      publicationDate: new Date().toLocaleString("en-US", {
        timeZone: "UTC"
      })
    };
    postModel
      .update(entity)
      .then(Post => {
        res.redirect("back");
      })
      .catch(err => {
        next(err);
      });
  },

  changeCatName: (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
    } else {
      var entity = req.body;
      categoryModel
        .update(entity)
        .then(Post => {
          res.redirect("back");
        })
        .catch(err => {
          next(err);
        });
    }
  },

  changeTagName: (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
    } else {
      var entity = req.body;
      tagModel
        .update(entity)
        .then(Post => {
          res.redirect("back");
        })
        .catch(err => {
          next(err);
        });
    }
  },

  changePosition: (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
    } else {
      var entity = req.body;
      userModel
        .update(entity)
        .then(Post => {
          res.redirect("back");
        })
        .catch(err => {
          next(err);
        });
    }
  },

  changeCategory: async (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
    } else {
      var idEditor = req.body.idEditor;
      var listIdCat = req.body.categories;
      await editorModel
        .delete(idEditor)
        .then(data => {
          console.log("Đã Xoá được dòng bảng Editor");
        })
        .catch(err => {
          console.log(err);
        });
      if (Array.isArray(listIdCat)) {
        for (let i = 0; i < listIdCat.length; i++) {
          var entityEditor = {
            idEditor: idEditor,
            idCategory: listIdCat[i]
          };
          await editorModel
            .add(entityEditor)
            .then(data => {
              console.log("Đã sửa được bảng Editor");
            })
            .catch(err => {
              next(err);
            });
        }
      } else {
        var entityEditor = {
          idEditor: idEditor,
          idCategory: listIdCat
        };
        editorModel
          .add(entityEditor)
          .then(data => {
            console.log("Đã sửa được bảng Editor");
          })
          .catch(err => {
            next(err);
          });
      }
      res.redirect("back");
    }
  },

  changePremiumDate: (req, res, next) => {
    console.log(req.body);

    if (Date.parse(req.body.expirationdate)) {
      var date = new Date(req.body.expirationdate).toLocaleString("en-US", {timeZone: "UTC"});
      var currentdate = new Date().toLocaleString("en-US", {timeZone: "UTC"});
      if(date < currentdate){
        date = currentdate;
      }
    } else {    
      var date = new Date().toLocaleString("en-US", {timeZone: "UTC"});
    }
    // console.log(date);
    userModel
      .updateTimePremium(req.body.id, date)
      .then(Post => {
        res.redirect("back");
      })
      .catch(err => {
        next(err);
      });
  },

  deleteCategory: async (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
    } else {
      var entity = {
        id: id,
        isDelete: "true"
      };
      try {
        await categoryModel.update(entity);
        try {
          var catSon = await categoryModel.deleteByIdCat(id);
          catSon.rows.forEach(cat => {
            postModel.deleteByIdCat(cat.id);
          });
        } catch (error) {
          console.log(error);
        } finally {
          await postModel.deleteByIdCat(id);
          res.redirect("back");
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  },

  deleteTag: (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
    } else {
      var entity = {
        id: id,
        isDelete: "true"
      };
      tagModel
        .update(entity)
        .then(Post => {
          res.redirect("back");
        })
        .catch(err => {
          next(err);
        });
    }
  },

  deleteUser: (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
    } else {
      var entity = {
        id: id,
        isDelete: "true"
      };
      userModel
        .update(entity)
        .then(Post => {
          res.redirect("back");
        })
        .catch(err => {
          next(err);
        });
    }
  },

  addPost: (req, res, next) => {
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
        res.redirect("/admin/post/pending");
      })
      .catch(err => {
        next(err);
      });
  },
  // Phần post
  textEditor: (req, res) => {
    res.render("admin/textEditor", {
      layout: "admin.hbs",
      titlePage: "Viết bài"
    });
  },

  pending: (req, res, next) => {
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
          {
            timeZone: "Asia/Saigon"
          }
        );
      }
      res.render("admin/pending", {
        layout: "admin.hbs",
        titlePage: "Bài chưa duyệt",
        posts
      });
    }).catch(err => {
      next(err);
    });
  },

  denied: (req, res, next) => {
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
          {
            timeZone: "Asia/Saigon"
          }
        );
      }
      res.render("admin/denied", {
        layout: "admin.hbs",
        titlePage: "Bài bị từ chối",
        posts
      });
    }).catch(err => {
      next(err);
    });
  },

  approved: (req, res, next) => {
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
          {
            timeZone: "Asia/Saigon"
          }
        );
      }
      res.render("admin/approved", {
        layout: "admin.hbs",
        titlePage: "Bài đã được duyệt & chờ xuất bản",
        posts
      });
    }).catch(err => {
      next(err);
    });
  },

  published: (req, res, next) => {
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
          {
            timeZone: "Asia/Saigon"
          }
        );
      }
      res.render("admin/published", {
        layout: "admin.hbs",
        titlePage: "Bài đã xuất bản",
        posts
      });
    }).catch(err => {
      next(err);
    });
  },

  loadEditPost: (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.render("admin/editPost", {
        layout: "admin.hbs",
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
        res.render("admin/editPost", {
          layout: "admin.hbs",
          titlePage: "Chỉnh sửa bài viết",
          posts: data.rows[0],
          err: false
        });
      } else {
        res.render("admin/editPost", {
          layout: "admin.hbs",
          titlePage: "Chỉnh sửa bài viết",
          err: true
        });
      }
    }).catch(err => {
      next(err);
    });
  },

  editPost: async (req, res, next) => {
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
    res.redirect("/admin/post/pending");
  },

  deletePost: (req, res, next) => {
    var id = req.params.id;
    if (isNaN(id)) {
      res.redirect("back");
      console.log("This id does not exist");
    } else {
      var entity = {
        id: id,
        isDelete: "true"
      };
      postModel
        .update(entity)
        .then(Post => {
          res.redirect("back");
        })
        .catch(err => {
          next(err);
        });
    }
  }
};
