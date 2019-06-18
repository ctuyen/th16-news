var postModel = require("../models/posts.model");
var authModel = require("../models/auth.model");

module.exports.checkPremium = async (req, res, next) => {
  var post = await postModel.checkPremium(req.params.idPost);

  if (post.rowCount == 0 || !post.rows[0].ispremium) {
    next();
  } else {
    if (!req.signedCookies.userId) {
      res.redirect("/auth/login");
      return;
    }

    var user = await authModel.checkId(req.signedCookies.userId);
    if (!user.rows[0].expirationdate) {
      res.redirect("/request-premium");
      return;
    } else {
      let date = new Date(user.rows[0].expirationdate);
      let dateNow = new Date();

      if (dateNow.valueOf() >= date.valueOf()) {
        res.redirect("/request-premium");
        return;
      }

      next();
    }
  }
};
