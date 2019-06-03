
module.exports.category = function (req, res) {
  res.render('admin/category')
}

module.exports.user = function(req, res) {
  res.render("admin/user");
};

module.exports.tag = function(req, res) {
  res.render("admin/tag");
};

module.exports.post = function(req, res) {
  res.render("admin/post");
};
