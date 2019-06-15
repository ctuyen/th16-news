var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from tag where isDelete = false");
  },

  single: id => {
    return db.load(`select * from tag where id = ${id} and isDelete = false`);
  },

  add: entity => {
    return db.add("tag", entity);
  },

  update: entity => {
    return db.update("tag", entity);
  },

  delete: id => {
    return db.delete("tag", "id", id);
  },

  getTagsPost: id => {
    return db.load("select * from tagpost");
  }
}