var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from categories");
  },

  allWithDetails: () => {
    return db.load(`select c.id as CatId, c.name, count(p.id) as numOfPosts
        from categories c LEFT join posts p ON c.id = p.idCategory
        group by c.id, c.name`);
  },

  single: id => {
    return db.load(`select * from categories where id = ${id}`);
  },

  add: entity => {
    return db.add("categories", entity);
  },

  update: entity => {
    return db.update("categories", "id", entity);
  },

  delete: id => {
    return db.delete("categories", "id", id);
  },

  // load: () => {
  //   var sql = "select * from categories";
  //   return db.load(sql);
  // },
  loadFather: () => {
    var sql = "select * from categories where idCategory is null";
    return db.load(sql);
  },
  loadSon: id => {
    var sql = `select * from categories where idCategory = ${id}`;
    return db.load(sql);
  }

  // load -> all
};