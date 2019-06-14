var authModel = require("../models/auth.model");
var userModel = require('../models/users.model');

const bcrypt = require("bcrypt");
const saltRounds = 10;
const axios = require('axios');

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
        if (users.rowCount == 0) {
          res.render("auth/login", {
            errors: ["Email hoặc mật khẩu sai."],
            values: req.body,
            layout: false
          });
          return;
        }

        authModel.getPassword(email)
          .then(hashedPassword => {
            if (!bcrypt.compareSync(password, hashedPassword.rows[0].password)) {
              res.render("auth/login", {
                errors: ["Email hoặc mật khẩu sai."],
                values: req.body,
                layout: false
              })
              return
            }

            res.cookie("userId", users.rows[0].id, {
              signed: true,
              expires: 0,
              httpOnly: true
            });
            res.redirect("/");
          })
          .catch(err => {
            throw err
          })
      })
      .catch(err => {
        throw err
      });
  },

  register: (req, res) => {
    res.render('auth/register', {
      layout: false
    })
  },

  postRegister: (req, res) => {
    let entity = {}
    entity.email = req.body.email
    entity.fullName = `${req.body.firstName} ${req.body.lastName}`
    entity.position = 'user'
    entity.urlAvatar = '/images/no_image.png'

    var checkEmail = authModel.checkEmail(req.body.email);

    checkEmail
      .then(users => {
        if (users.rowCount > 0) {
          res.render("auth/register", {
            errors: ["Địa chỉ mail đã tồn tại. Thử đăng nhập!"],
            layout: false
          });
          return;
        }

        entity.password = bcrypt.hashSync(req.body.password, saltRounds);

        userModel.add(entity)
          .then(
            res.redirect("/auth/login")
          )
          .catch(err => {
            res.redirect("/auth/register");
            throw err
          })
      })
      .catch(err => {
        throw err
      });

  },

  forgotpass: (req, res) => {
    res.render('auth/forgot-password', {
      layout: false
    })
  },

  postForgotpass: (req, res) => {
    let email = req.body.email

    var checkEmail = authModel.checkEmail(email);

    checkEmail
      .then(users => {
        if (users.rowCount == 0) {
          res.render("auth/forgot-password", {
            layout: false,
            notices: ["Địa chỉ mail chưa được đăng kí. Đăng kí ngay!"]
          });
        } else {
          res.render("auth/forgot-password", {
            layout: false,
            notices: ["Một mail xác nhận đã được gửi vào hộp thư của bạn. Kiểm tra ngay!"]
          });
        }

        // res.redirect("/auth/login");
      })
      .catch(err => {
        throw err
      });

  },

  redirect: (req, res) => {
    const clientID = 'c3a5b7c26e6b641237fd'
    const clientSecret = 'ca86b3798cd71c8ec9ae406df1cff0443475f238'

    const requestToken = req.query.code
    axios({
      // make a POST request
      method: 'post',
      // to the Github authentication API, with the client ID, client secret
      // and request token
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
        accept: 'application/json'
      }
    }).then((response) => {
      // Once we get the response, extract the access token from
      // the response body
      const accessToken = response.data.access_token
      // redirect the user to the welcome page, along with the access token
      res.redirect(`/auth/welcome?access_token=${accessToken}`)
    })
  },

  welcome: (req, res) => {
    res.render('auth/welcome', {
      layout: false
    })
  }
};