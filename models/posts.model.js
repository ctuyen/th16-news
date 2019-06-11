var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from posts");
  },
  allWithDetails: ()=>{
    var sql = `select p.id, p.title, p.summary, p.content, p.urlthumbnail, p.view, p.writingdate, p.publicationdate, u.fullname as writer, p.idcategory, c.name as category, u.urlavatar from posts as p, categories as c, users as u where p.idwriter=u.id and p.idcategory=c.id`;
    return db.load(sql);
  },
  allByCat: id => {
    return db.load(`select * from posts where idCategory = ${id}`);
  },

  single: id => {
    return db.load(`select * from posts where id = ${id}`);
  },

  singleWithDetal: id => {
    var sql = `select p.id, p.title, p.summary, p.content, p.urlthumbnail, p.view, p.writingdate, p.publicationdate, u.fullname as writer, p.idcategory, c.name as category, u.urlavatar from posts as p, categories as c, users as u where p.id = ${id} and p.idwriter=u.id and p.idcategory=c.id`;
    return db.load(sql);
  },

  add: entity => {
    return db.add("posts", entity);
  },

  update: entity => {
    return db.update("posts", "id", entity);
  },

  delete: id => {
    return db.delete("posts", "id", id);
  },

  loadTag: id => {
    var sql = `select t.name as tagname from tag as t, tagpost as tp where t.id = tp.idtag and tp.idpost=${id}`;
    return db.load(sql);
  },
  
  loadComment: id => {
    var sql = `select fullname, urlavatar, commentdate, content from comment as cm, users as u where cm.iduser = u.id and cm.idpost = ${id}`;
    return db.load(sql);
  },

  allWithStatus: status => {
    var sql = `select * from posts where status = '${status}'`;
    return db.load(sql);
  }
};
