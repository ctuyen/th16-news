var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from users");
  },

  single: id => {
    return db.load(`select * from users where id = ${id}`);
  },

  add: entity => {
    return db.add("users", entity);
  },

  update: entity => {
    return db.update("users", "id", entity);
  },

  delete: id => {
    return db.delete("users", "id", id);
  }
}