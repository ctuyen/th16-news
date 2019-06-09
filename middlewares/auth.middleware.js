var authModel = require('../models/auth.model')

module.exports.requireAuth = (req, res, next) => {
  console.log(req.signedCookies)
  if (!req.signedCookies.userId) {
    res.redirect('/auth/login')
    return
  }

  //tim xem user co trong db hay khong
  var checkId = authModel.checkId(req.signedCookies.userId);
  checkId
    .then(user => {
      console.log(user.rowCount)
      if (user.rowCount === 0) {
        res.redirect("/auth/login");
        return;
      }
      else {
        res.locals.user = user.rows[0];
      }
    })
    .catch(err => {
      throw err;
    });

  next();
}
