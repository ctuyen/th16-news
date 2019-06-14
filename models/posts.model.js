var db = require("../utils/db");

module.exports = {
  all: () => {
    return db.load("select * from posts where isDelete = false");
  },
  allwithLimit: limit => {
    return db.load(
      `select * from posts where isDelete = false order by publicationDate desc limit ${limit}`
    );
  },
  topView: ()=>{
    return db.load(
      `select * from posts where isDelete = false order by publicationDate desc limit ${limit}`
    );
  },
  allWithDetails: () => {
    var sql = `select p.*, u.fullname as writer, urlavatar, c.name as category, u.urlavatar from posts as p, categories as c, users as u where p.idwriter=u.id and p.idcategory=c.id`;
    return db.load(sql);
  },
  allByCat: id => {
    return db.load(
      `select * from posts where idCategory = ${id} and status = 'draft' and isDelete = false`
    );
  },

  single: id => {
    return db.load(`select * from posts where id = ${id} and isDelete = false`);
  },

  singleWithDetal: id => {
    var sql = `select p.id, p.title, p.summary, p.content, p.urlthumbnail, p.view, p.writingdate, p.publicationdate, u.fullname as writer, p.idcategory, c.name as category, u.urlavatar from posts as p, categories as c, users as u where p.id = ${id} and p.idwriter=u.id and p.idcategory=c.id`;
    return db.load(sql);
  },

  add: entity => {
    return db.add("posts", entity);
  },

  update: entity => {
    return db.update("posts", entity);
  },

  delete: id => {
    return db.delete("posts", "id", id);
  },

  loadTag: id => {
    var sql = `select t.* from tag as t, tagpost as tp where t.id = tp.idtag and tp.idpost=${id}`;
    return db.load(sql);
  },

  loadComment: id => {
    var sql = `select fullname, urlavatar, commentdate, content from comment as cm, users as u where cm.iduser = u.id and cm.idpost = ${id}`;
    return db.load(sql);
  },

  allWithStatus: status => {
    var sql = `select * from posts where status = '${status}' and isDelete = false`;
    return db.load(sql);
  },

  allWithStatusTime: compare => {
    var sql = `select * from posts where status = 'accept' and isDelete = false and publicationDate ${compare} current_timestamp`;
    return db.load(sql);
  },

  numberByStatus: status => {
    var sql = `select count(*) as num from posts where status = '${status}' and isDelete = false`;
    return db.load(sql);
  },

  numberByStatusTime: compare => {
    var sql = `select count(*) as num from posts where status = 'accept' and isDelete = false and publicationDate ${compare} current_timestamp`;
    return db.load(sql);
  },
  pageByCat: (idcat, offset, limit) => {
    var sql = `select p.*, u.fullname as writer, urlavatar, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id and p.idcategory = ${idcat} 
    limit ${limit} offset ${offset}`; // and p.idcategory=${idcat}
    return db.load(sql);
  },
  numByCat: idcat => {
    var sql = `select count(*) as total from posts where idcategory=${idcat}`;
    return db.load(sql);
  },
  addView: idPost => {
    var sql = `update posts set view =view +1 where id=${idPost}`;
    return db.updateSQL(sql);
  }
};
