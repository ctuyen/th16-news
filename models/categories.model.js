var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from categories where isDelete = false");
  },

  allWithDetails: () => {
    return db.load(`select c.id as CatId, c.name, count(p.id) as numOfPosts
                  from categories c left join 
                  (select * from posts where status = 'draft' and isDelete = false) p 
                  on c.id = p.idCategory
                  group by c.id, c.name`);
  },

  allCatOfEditor: idEditor =>{
    return db.load(`select * from editor where idEditor = ${idEditor}`);
  },

  allWithLimit: (offset, limit) => {
    return db.load(`select * from categories where isDelete = false offset ${offset} limit ${limit}`);
  },
  HighestEachCat: () => {},

  single: id => {
    return db.load(`select * from categories where id = ${id} and isDelete = false`);
  },

  add: entity => {
    return db.add("categories", entity);
  },

  update: entity => {
    return db.update("categories", entity);
  },

  deleteByIdCat: idCategory => {
    return db.updateSQL(`update table categories set isDelete = true where idCategory = ${idCategory}`);
  },

  delete: id => {
    return db.delete("categories", "id", id);
  },
  
  loadFather: () => {
    var sql = "select * from categories where idCategory is null and isDelete = false";
    return db.load(sql);
  },
  loadSon: id => {
    var sql = `select * from categories where idCategory = ${id} and not (select isDelete from categories where id = ${id})`;
    return db.load(sql);
  },
  loadSonCat: id => {
    var sql = `select * from categories where idCategory = ${id} and isdelete=false`;
    return db.load(sql);
  }

  // load -> all
};
