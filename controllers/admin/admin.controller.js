module.exports = {
  admin: (req, res) => {
    res.redirect("/admin/category")
  },

  category: (req, res) => {
    res.render("admin/category", {
      title: 'Quản lí chuyên mục | Salad News',
      layout: 'admin.hbs'
    });
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
