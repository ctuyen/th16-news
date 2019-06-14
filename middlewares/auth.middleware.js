var authModel = require('../models/auth.model')

module.exports.requireAuth = (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.redirect('/auth/login')
    return
  }

  //tim xem user co trong db hay khong
  var checkId = authModel.checkId(req.signedCookies.userId);
  checkId
    .then(user => {
      if (user.rowCount === 0) {
        res.redirect("/auth/login");
        return;
      } else {
        res.locals.user = user.rows[0];
      }
    })
    .catch(err => {
      throw err;
    });

  next();
};

module.exports.requireAdmin = (req, res, next) => {
  var getPosition = authModel.getPosition(req.signedCookies.userId);
  getPosition
    .then(user => {
      if (user.rows[0].position !== 'admin') {
        res.redirect('/');
        return;
      }
      next();
    })
    .catch(err => {
      throw err
    })
}

module.exports.requireEditer = (req, res, next) => {
  var getPosition = authModel.getPosition(req.signedCookies.userId);
  getPosition
    .then(user => {
      if (user.rows[0].position !== 'editor') {
        res.redirect('/');
        return;
      }
      next();
    })
    .catch(err => {
      throw err
    })
}

module.exports.requireWriter = (req, res, next) => {
  var getPosition = authModel.getPosition(req.signedCookies.userId);
  getPosition
    .then(user => {
      if (user.rows[0].position !== 'writer') {
        res.redirect('/');
        return;
      }
      next();
    })
    .catch(err => {
      throw err
    })
}