var categoryModel = require('../../models/categories.model')

module.exports = {
  admin: (req, res) => {
    res.redirect("/admin/category")
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
      })
  },

  user: (req, res) => {
    res.render("admin/user", {
      title: 'Quản lí người dùng | Salad News',
      layout: 'admin.hbs'
    });
  },

  tag: (req, res) => {
    res.render("admin/tag", {
      title: 'Quản lí thẻ | Salad News',
      layout: 'admin.hbs'
    });
  },

  post: (req, res) => {
    res.render("admin/post", {
      title: 'Quản lí bài đăng | Salad News',
      layout: 'admin.hbs'
    });
  }
};
