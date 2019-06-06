module.exports.requireAuth = function (req, res, next) {
  if (!req.cookies.userId) {
    res.redirect('/auth/login')
    return
  }

  //tim xem user co trong db hay khong
  // ...

  next()
}
