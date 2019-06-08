var db = require("../utils/db");

module.exports = {
  load: () => {
    var sql = "select * from categories";
    return db.load(sql);
  },
  loadFather: () => {
    var sql = "select * from categories where idCategory = null";
    return db.load(sql);
  },
  loadSon: id => {
    var sql = `select * from categories where idCategory = ${id}`;
    return db.load(sql);
  }
};
