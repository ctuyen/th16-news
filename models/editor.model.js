var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from editor");
  },

  single: (idEditor) => {
    return db.load(`select * from editor where idEditor = ${idEditor}`);
  },

  add: entity => {
    return db.add("editor", entity);
  },

  delete: id => {
    return db.delete("editor", "idEditor", id);
  },
};
