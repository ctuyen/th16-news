var authModel = require("../models/auth.model");
var userModel = require('../models/users.model');

const bcrypt = require("bcrypt");
const saltRounds = 10;
const axios = require('axios');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const querystring = require('querystring');

let backURL;

module.exports = {
  auth: (req, res) => {
    res.redirect("/auth/login");
  },

  login: (req, res) => {
    if (req.signedCookies.userId) {
      res.redirect('/')
      return
    }
    res.render("auth/login", {
      layout: false
    });
    backURL = req.headers.referer || '/';
  },

  postLogin: (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    var checkEmail = authModel.checkEmail(email);

    checkEmail
      .then(users => {
        if (users.rowCount == 0 || users.rows[0].isdelete == true) {
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
            res.redirect(backURL);
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
    let captcha = 'g-recaptcha-response';
    var checkCaptcha;
    const data = {
      secret: '6LeZOakUAAAAALD2tkTC4lv706BkMzw7D1B2iSMQ',
      response: req.body[captcha]
    };

    axios({
      // make a POST request
      method: 'post',
      data: querystring.stringify(data),
      // and request token
      url: `https://www.google.com/recaptcha/api/siteverify`,
      // Set the content type header, so that we get the response in JSON
      headers: {
        accept: 'application/json'
      }
    }).then(response => {
      if (!response.data.success) {
        res.render('auth/register', {
          layout: false,
          errors: ["Captcha không thành công."]
        });
        return;
      }

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
    })
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
          // gui mail
          let userMail = users.rows[0].email;

          async.waterfall([
            function (done) {
              crypto.randomBytes(10, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
              });
            },
            function (token, done) {
              let entity = {
                id: users.rows[0].id,
                token: token
              };

              let changeToken = authModel.update(entity)

              changeToken
                .then(data => {
                  done(null, token)
                })
                .catch(err => {
                  throw err
                })
            },
            function (token) {
              var transporter = nodemailer.createTransport({
                service: "Gmail",
                secure: true, // true for 465, false for other ports
                auth: {
                  user: process.env.EMAIL_SENDER,
                  pass: process.env.EMAIL_PASS
                }
              });

              var mailOptions = {
                to: userMail,
                from: `"Salad News" <${process.env.EMAIL_SENDER}>`,
                subject: 'SaladNews | Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://localhost:3000/auth/changepass/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
              };
              transporter.sendMail(mailOptions, function (err) {});

              console.log('gui mail reset done: ', userMail);
              res.render("auth/forgot-password", {
                layout: false,
                notices: ["Một mail xác nhận đã được gửi vào hộp thư của bạn. Kiểm tra ngay!"]
              });
            }
          ], function (err, result) {
            if (err) throw err;
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
  },

  changepass: (req, res) => {
    if (!req.params.token) {
      res.redirect('/auth/register')
      return
    }

    let checkToken = authModel.checkToken(req.params.token)

    checkToken
      .then(user => {
        if (user.rowCount == 0) {
          res.redirect('/auth/register')
          return
        }

        res.render('auth/changepass', {
          layout: false
        })
      })
      .catch(err => {
        throw err
      })

  },

  postChangepass: (req, res) => {
    async.waterfall([
      function (done) {
        let checkToken = authModel.checkToken(req.params.token)

        checkToken
          .then(user => {
            var userMail = user.rows[0].email

            let entity = {
              id: user.rows[0].id,
              password: bcrypt.hashSync(req.body.password, saltRounds),
              token: null
            }

            let changePass = authModel.update(entity)

            changePass
              .then(data => {
                done(null, userMail)
              })
              .catch(err => {
                throw err
              })
          })
          .catch(err => {
            throw err
          })
      },
      function (userMail, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_SENDER,
            pass: process.env.EMAIL_PASS
          }
        });

        var mailOptions = {
          to: userMail,
          from: `"Salad News" <${process.env.EMAIL_SENDER}>`,
          subject: 'SaladNews | Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + userMail + ' at Salad News has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          done(err);
        });

        res.render('auth/login', {
          layout: false,
          notices: ['Bạn đã đổi mật khẩu thành công.']
        });
      }
    ], function (err) {});
  },

  signout: (req, res) => {
    res.clearCookie('userId')
    res.redirect('/')
  }
};