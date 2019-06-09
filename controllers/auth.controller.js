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

    var checkEmail = authModel.checkEmail(email);

    checkEmail.then(users => {
      var num = users.rowCount;
      if (num === 0) {
        res.render("auth/login", {
          errors: ["Người dùng không tồn tại."],
          values: req.body,
          layout: false
        });
        return;
      }
      
      //just test
      if (!bcrypt.compareSync(password, "$2b$10$EOBbzOfvHlffVfm8LN1Dmunv6nqlrwCMArFadM1swYlDrMln9EMm6")) {
        res.render("auth/login", {
          errors: ["Nhập sai mật khẩu."],
          values: req.body,
          layout: false
        })
        return
      }

      res.cookie("userId", users.rows[0].id, {
        signed: true
      });
      res.redirect("/");
    }).catch(err => {
      console.log(err);
    });
  },

  register: (req, res) => {
    res.render('auth/register', {
      layout: false
    })
  },

  postRegister: (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let fullName = `${req.body.firstName} ${req.body.lastName}`;

    var checkEmail = authModel.checkEmail(email);

    checkEmail
      .then(users => {
        var num = users.rowCount;
        if (num > 0) {
          res.render("auth/register", {
            errors: ["Địa chỉ mail đã tồn tại. Thử đăng nhập!"],
            layout: false
          });
          return;
        }

        res.redirect("/auth/login");
      })
      .catch(err => {
        throw err
      });
    
    //continue 
  }
};
