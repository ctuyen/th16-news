const bcrypt = require("bcrypt");
const saltRounds = 10;

var categoryModel = require("../../models/categories.model");
var tagModel = require("../../models/tags.model");
var postModel = require("../../models/posts.model");
var userModel = require("../../models/users.model");

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
    }

    data.editers = [];

    for (let [index, editer] of editers.rows.entries()) {
      let editerRender = {};
      editerRender.fullname = editer.fullname;
      editerRender.email = editer.email;

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

  post: (req, res) => {
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
          "vi-VI", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }
        );

      }
      res.render("admin/post", {
        title: "Quản lí bài đăng | Salad News",
        layout: "admin.hbs",
        posts
      });
    }).catch(err => console.log(err));
  },

  postCategory: (req, res) => {
    if (req.body.tagname === '') {
      res.redirect("/admin/category")
      return
    }

    let entity = {}
    entity.name = req.body.tagname;
    if (req.body.parent != "0") {
      entity.idCategory = req.body.parent;
    }

    categoryModel.add(entity)
      .then(
        res.redirect("/admin/category")
      )
      .catch(err => {
        throw err
      })
  },

  postTag: (req, res) => {
    let entity = {}
    entity.name = req.body.tagname
    tagModel.add(entity)
      .then(
        res.redirect('/admin/tag')
      )
      .catch(err => {
        throw err
      })


  },

  postUser: (req, res) => {
    let entity = {}
    entity.fullname = req.body.name
    entity.email = req.body.email
    entity.position = req.body.position
    entity.password = bcrypt.hashSync(req.body.password, saltRounds);

    userModel.add(entity)
      .then(
        res.redirect('user')
      )
      .catch(err => {
        throw err
      })

  },

  postPost: (req, res) => {

  }
};