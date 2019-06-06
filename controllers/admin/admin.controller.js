module.exports = {
  category: (req, res) => {
    res.render("admin/category");
  },

  user: (req, res) => {
    res.render("admin/user");
  },

  tag: (req, res) => {
    res.render("admin/tag");
  },

  post: (req, res) => {
    res.render("admin/post");
  }
};
