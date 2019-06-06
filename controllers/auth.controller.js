var md5 = require('md5')
const bcrypt = require('bcrypt')
const saltRounds = 10;

var userDemo = {
  email: "congtuyen598@gmail.com",
  password: "81dc9bdb52d04dc20036dbd8313ed055", // md5 '1234'
  id: "227t"
};

module.exports.auth = function (req, res) {
  res.redirect('/auth/login')
}

module.exports.login = function (req, res) {
  res.render('auth/login');
};

module.exports.postLogin = function(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  if (email !== userDemo.email) {
    res.render("auth/login", {
      errors: ["User does not exists."],
      values: {
        email: req.body.email,
        password: req.body.password
      }
    });
    return;
  }
  // using md5
  // let hashedPassword = md5(password)

  // if (userDemo.password !== hashedPassword) {
  //   res.render("auth/login", {
  //     errors: ["Wrong password."],
  //     values: req.body
  //   });
  //   return;
  // }

  //using bcrypt - sync
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync('1234', salt);
  // Store hash in your password DB.

  if (!bcrypt.compareSync(password, hash)) {
    res.render("auth/login", {
      errors: ["Wrong password."],
      values: {
        email: req.body.email,
        password: req.body.password
      }
    });
    return;
  }

  res.cookie("userId", userDemo.id);
  res.redirect("/");
};
