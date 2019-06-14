var postModel = require("../../models/posts.model");
var tagPostModel = require("../../models/tagPost.model");
module.exports = {
  list: (req, res) => {
    var id = req.params.id;
    // console.log(id);
    var p = postModel.allByCat(id);
    p.then(async data => {
      var posts = data.rows;
      if (posts.length > 0) {
        console.log(data);
        for (var post of posts) {
          var t = await postModel.loadTag(post.id);
          var temp = [];
          t.rows.forEach(i => {
            temp.push(i);
          });
          // console.log(temp);
          post.tags = temp;
          post.date = new Date(`${post.writingdate}`).toLocaleDateString(
            "vi-VI",
            {
              day: "numeric",
              month: "short",
              year: "numeric"
            },
            { timeZone: "Asia/Saigon" }
          );
        }
        for (const c of res.locals.lcCategories) {
          if (c.catid === +id) {
            c.isSelect = true;
          }
        }
        for (const c of res.locals.lcCategories) {
          if (c.catid === +id) {
            c.isActive = true;
          }
        }
      }
      res.render("editor/listPost", {
        posts,
        titlePage: "Editor",
        layout: "editor.hbs"
      });
    }).catch(err => {
      console.log(err);
    });
  },
  acceptPost: async (req, res) => {
    var entity = {
      id: req.body.id,
      idCategory: parseInt(req.body.category),
      publicationDate: new Date(req.body.publicationDate).toLocaleString(
        "en-US",
        { timeZone: "UTC" }
      ),
      status: "accept"
    };
    // console.log(entity.publicationDate);

    postModel
      .update(entity)
      .then(Post => {
        console.log("Đã chấp nhận bài viết");
        res.redirect("back");
      })
      .catch(err => {
        console.log(err);
      });
    await tagPostModel
      .delete(entity.id)
      .then(data => {
        console.log("Đã Xoá được dòng bảng tagPost");
      })
      .catch(err => {
        console.log(err);
      });
    for (let i = 0; i < tagList.length; i++) {
      var entityTagPost = {
        idTag: parseInt(tagList[i]),
        idPost: entity.id
      };
      await tagPostModel
        .add(entityTagPost)
        .then(data => {
          console.log("Đã sửa được bảng tagPost");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  denyPost: (req, res) => {
    var entity = {
      id: req.body.id,
      reason: req.body.reason,
      status: "deny"
    };
    // console.log(entity);
    postModel
      .update(entity)
      .then(Post => {
        console.log("Đã từ chối bài viết");
        res.redirect("back");
      })
      .catch(err => {
        console.log(err);
      });
  }
};
