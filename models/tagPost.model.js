var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from tagPost");
  },

  single: (idTag, idPost) => {
    return db.load(`select * from tagPost where idTag = ${idTag} and idPost= ${idPost}`);
  },

  add: entity => {
    return db.add("tagPost", entity);
  },

  delete: id => {
    return db.delete("tagPost", "idPost", id);
  },
};
