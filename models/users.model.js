var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from users where isDelete = false");
  },

  single: id => {
    return db.load(`select * from users where id = ${id} and isDelete = false`);
  },

  add: entity => {
    return db.add("users", entity);
  },

  update: entity => {
    return db.update("users", entity);
  },

  delete: id => {
    return db.delete("users", "id", id);
  },

  allStaff: () => {
    return db.load(`select * from users where position <> 'user' and position <> 'admin' and isDelete = false`);
  },

  allUser: () => {
    return db.load(`select * from users where position = 'user' and isDelete = false`);
  },

  allEditer: () => {
    return db.load(`select * from users where position = 'editor' and isDelete = false`)
  },

  catesOfEditer: (id) => {
    return db.load(`select * from editor where idEditor = ${id}`)
  }
}