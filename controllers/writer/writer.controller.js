var db = require("../../utils/db");
module.exports = {
  textEditor: (req, res) => {
    res.render("writer/textEditor", {
      layout: "writer.hbs",
      titlePage: "Viết bài"
    });
  },

  pending: (req, res) => {
    var p = db.load("select * from posts");
    p.then(data => {
      res.render("writer/pending", {
        layout: "writer.hbs",
        titlePage: "Bài chưa duyệt",
        posts: data.rows
      });
    }).catch(err => {
      console.log(err);
    });
  },

  denied: (req, res) => {
    res.render("writer/denied", {
      layout: "writer.hbs",
      titlePage: "Bài bị từ chối"
    });
  },

  approved: (req, res) => {
    res.render("writer/approved", {
      layout: "writer.hbs",
      titlePage: "Bài đã duyệt và chờ xuất bản"
    });
  },

  published: (req, res) => {
    res.render("writer/published", {
      layout: "writer.hbs",
      titlePage: "Bài đã xuất bản"
    });
  }
};
