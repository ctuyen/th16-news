var postModel = require("../../models/posts.model");

module.exports = {
  list: (req, res) => {
    var id = req.params.id;
    // console.log(id);
    var p = postModel.allByCat(id);
    p.then(data => {
      // console.log(data.rows);
      for (const c of res.locals.lcCategories) {
          if(c.catid === +id ){
              c.isActive = true;
          }
      }
      res.render("editor/listPost", {
        posts: data.rows,
        titlePage: "Editor",
        layout: "editor.hbs"
      });
    }).catch(err => {
      console.log(err);
    });
  }
};
