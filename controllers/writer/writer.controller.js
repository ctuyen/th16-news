var postModel = require("../../models/posts.model");
module.exports = {
  textEditor: (req, res) => {
    res.render("writer/textEditor", {
      layout: "writer.hbs",
      titlePage: "Viết bài"
    });
  },

  pending: (req, res) => {
    var p = postModel.all();
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
    var p = postModel.all();
    p.then(data => {
      res.render("writer/denied", {
        layout: "writer.hbs",
        titlePage: "Bài chưa duyệt",
        posts: data.rows
      });
    }).catch(err => {
      console.log(err);
    });
  },

  approved: (req, res) => {
    var p = postModel.all();
    p.then(data => {
      res.render("writer/approved", {
        layout: "writer.hbs",
        titlePage: "Bài chưa duyệt",
        posts: data.rows
      });
    }).catch(err => {
      console.log(err);
    });
  },

  published: (req, res) => {
    var p = postModel.all();
    p.then(data => {
      res.render("writer/published", {
        layout: "writer.hbs",
        titlePage: "Bài chưa duyệt",
        posts: data.rows
      });
    }).catch(err => {
      console.log(err);
    });
  }
};
