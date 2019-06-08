var authModel = require("../models/auth.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  auth: (req, res) => {
    res.redirect("/auth/login");
  },

  login: (req, res) => {
    res.render("auth/login", {
      layout: false
    });
  },

  postLogin: (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    
    // //using bcrypt - sync
    // let salt = bcrypt.genSaltSync(saltRounds);
    // let hashedPassword = bcrypt.hashSync(password, salt);

    var checkEmail = authModel.checkEmail(email);

    checkEmail.then(users => {
      var num = users.rowCount;
      if (num === 0) {
        res.render("auth/login", {
          errors: ["User does not exists."],
          values: req.body,
          layout: false
        });
        return;
      }
      
      if (!bcrypt.compareSync(password, "$2b$10$EOBbzOfvHlffVfm8LN1Dmunv6nqlrwCMArFadM1swYlDrMln9EMm6")) {
        res.render("auth/login", {
          errors: ["Wrong password."],
          values: req.body,
          layout: false
        })
        return
      }

      res.cookie("userId", users.rows[0].id);
      res.redirect("/");
    }).catch(err => {
      console.log(err);
    });
  }
};
