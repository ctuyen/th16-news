var authModel = require("../models/auth.model");
var md5 = require("md5");

const bcrypt = require("bcrypt");
const saltRounds = 10;

var userDemo = {
  email: "congtuyen598@gmail.com",
  password: "81dc9bdb52d04dc20036dbd8313ed055", // md5 '123456'
  id: "227t"
};

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
    //md5
    let hashedPassword = md5(password);
    console.log("hash cua tui: " + hashedPassword);

    var p = authModel.checkCacThu(email, hashedPassword);

    p.then(data => {
      var check = data.rows;
      console.log("\n\ncheck: " + check.length);
      if (check.length > 0) {
        res.end("ok");
      } else {
        res.end("deo ok");
      }
    }).catch(err => {
      console.log(err);
    });
    // if (p) {
    //   res.end("ok");
    // } else {
    //   res.end("deo ok");
    // }
  }
};

// // using md5
//     // let hashedPassword = md5(password)

//     // if (userDemo.password !== hashedPassword) {
//     //   res.render("auth/login", {
//     //     errors: ["Wrong password."],
//     //     values: req.body
//     //   });
//     //   return;
//     // }

//     //using bcrypt - sync
//     var salt = bcrypt.genSaltSync(saltRounds);
//     var hash = bcrypt.hashSync('1234', salt);
//     // Store hash in your password DB.

//     if (!bcrypt.compareSync(password, hash)) {
//       res.render("auth/login", {
//         errors: ["Wrong password."],
//         values: {
//           email: req.body.email,
//           password: req.body.password
//         },
//         layout: false
//       });
//       return;
//     }

//     res.cookie("userId", userDemo.id);
//     res.redirect("/");
//   }
