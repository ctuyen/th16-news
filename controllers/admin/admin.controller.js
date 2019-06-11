var categoryModel = require('../../models/categories.model')
var tagModel = require('../../models/tags.model')
var postModel = require('../../models/posts.model')
var userModel = require('../../models/users.model')

module.exports = {
  admin: (req, res) => {
    res.redirect("/admin/category")
  },

  category: async (req, res) => {
    var fatherCate = await categoryModel.loadFather();
    var fatherCates = fatherCate.rows;
    
    var categories = categoryModel.all();

    categories
      .then(data => {
        res.render("admin/category", {
          title: "Quản lí chuyên mục | Salad News",
          layout: "admin.hbs",
          categories: data.rows,
          fatherCates
        });
      })
      .catch(err => {
        throw err;
      })
  },

  user: async (req, res) => {
    // staffs, cate of editor, all users
    var data = {}

    var staffs = await userModel.allStaff();
    var users = await userModel.allUser();
    var editers = await userModel.allEditer();
    var categories = await categoryModel.all();

    if (staffs.rowCount > 0) {
      data.staffs = staffs.rows
    }

    if (users.rowCount > 0) {
      data.users = users.rows
    }

    data.editers = []

    for (let [index, editer] of editers.rows.entries()) {
      let editerRender = {}
      editerRender.fullname = editer.fullname;
      editerRender.email = editer.email;
      
      let idCategory = await userModel.catesOfEditer(editer.id)
      let category = []

      if (idCategory.rowCount > 0) {
        for (id of idCategory.rows) {
          let cate = await categoryModel.single(id.idcategory)
          category.push(cate.rows[0].name)
        }
      }

      editerRender.category = category;
      data.editers.push(editerRender);
    }

    if (categories.rowCount > 0) {
      let categoriesRender = []
      for (cate of categories.rows) {
        categoriesRender.push({id: cate.id, name: cate.name})
      }

      data.categories = categoriesRender;
    }

    res.render("admin/user", {
      title: 'Quản lí người dùng | Salad News',
      layout: 'admin.hbs',
      data
    });
  },

  tag: (req, res) => {
    var tags = tagModel.all()

    tags
      .then(data => {
        res.render("admin/tag", {
          title: 'Quản lí thẻ | Salad News',
          layout: 'admin.hbs',
          tags: data.rows
        });
      })
      .catch(err => {
        throw err
      })
  },

  post: (req, res) => {
    var posts = postModel.allWithStatus('draft')

    posts
      .then(async data => {
        //console.log(data.rows)
        //render: date, writer, category
        var draftPosts = data.rows;

        for (let [index, post] of data.rows.entries()) {

          // [writer, category, tags] = function() {
          //   let writer = userModel.single(post.idwriter)
          //   let category = categoryModel.single(post.idcategory)
          //   let tags = postModel.loadTag(post.id)

          //   return [writer, category, tags]
          // }

          let writer = await userModel.single(post.idwriter)
          let category = await categoryModel.single(post.idcategory)
          let tags = await postModel.loadTag(post.id)

          let date = new Date(`${post.writingdate}`).toLocaleDateString('vi-VI', {
            day : 'numeric',
            month : 'short',
            year : 'numeric'
          });

          draftPosts[index].date = date;

          if (category.rowCount > 0) {
            draftPosts[index].category = category.rows[0].name;
          }

          if (writer.rowCount > 0) {
            draftPosts[index].writer = writer.rows[0].fullname;
            draftPosts[index].urlAvatar = 'https://res.cloudinary.com/ctuyen/image/upload/v1560189828/th16-news/thing-654750_960_720.png' //writer.rows[0].urlavatar;
          }
          else {
            draftPosts[index].writer = 'No name'
          }

          if (tags.rowCount > 0) {
            let tagsRender = []
            for (tag of tags.rows) {
              tagsRender.push(tag.tagname)
            }

            draftPosts[index].tags = tagsRender;
          }
          
        }

        console.log('...done')

        res.render("admin/post", {
          title: 'Quản lí bài đăng | Salad News',
          layout: 'admin.hbs',
          draftPosts
        });
      })
      .catch(err => {
        throw err
      });
    
  }
};
