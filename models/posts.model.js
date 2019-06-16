var db = require("../utils/db");
var categoriesmodel = require("./categories.model");
module.exports = {
  all: () => {
    return db.load("select * from posts where isDelete = false");
  },
  topSlide: () => {
    var sql = `select * from posts 
    where status = 'accept' and isDelete = false 
    order by publicationDate desc, view desc limit 4`;
    return db.load(sql);
  },
  topDate: limit => {
    return db.load(
      `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
      from posts as p, categories as c, users as u 
      where p.idwriter=u.id and p.idcategory=c.id and p.isDelete = false order by publicationDate desc limit ${limit}`
    );
  },
  topView: limit => {
    return db.load(
      `select * from posts where isDelete = false order by view desc limit ${limit}`
    );
  },
  topWithCat: limit => {
    var sql = `select p.id, p.title, p.urlthumbnail, p.idCategory, p.publicationDate , c.name as category  
    from posts p, categories as c,
        (SELECT max(id) as id, idcategory, view
      FROM posts
        WHERE (idcategory, view) IN 
      (SELECT idcategory, max(view) as view FROM posts 
      where status = 'accept' and isDelete = false
        GROUP BY idcategory limit ${limit})
      group by idcategory, view) as t 
    where p.id=t.id and p.idcategory=c.id`;
    return db.load(sql);
  },
  // group: () => {
  //   var sql = `select idcategory, max(view) as maxview from posts group by idcategory`;
  //   return db.load(sql);
  // },
  allWithDetails: () => {
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id and p.status = 'draft'
    and p.isDelete = false and c.isDelete = false`;
    return db.load(sql);
  },
  allByCat: id => {
    return db.load(
      `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id and p.idCategory = ${id} 
    and p.status = 'draft' and p.isDelete = false and c.isDelete = false`
    );
  },

<<<<<<< HEAD
=======
  allByIdEditor: (id, status) => {
    return db.load(
      `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id and p.idEditor = ${id} 
    and p.status = '${status}' and p.isDelete = false and c.isDelete = false`
    );
  },
 
>>>>>>> 8c5b8b438fd0a6c99da1504156233f82a3958beb
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

  deleteByIdCat: idCategory => {
    return db.updateSQL(
      `update posts set isDelete = true where idCategory = ${idCategory}`
    );
  },

  loadTag: id => {
    var sql = `select t.* from tag as t, tagpost as tp where t.id = tp.idtag and tp.idpost=${id}`;
    return db.load(sql);
  },

  loadComment: id => {
    var sql = `select fullname, urlavatar, commentdate, content 
    from comment as cm, users as u 
<<<<<<< HEAD
     where cm.iduser = u.id and cm.idpost = ${id}`;
=======
    where cm.iduser = u.id and cm.idpost = ${id}`;
>>>>>>> 8c5b8b438fd0a6c99da1504156233f82a3958beb
    return db.load(sql);
  },

  allWithStatus: status => {
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
                from posts as p, categories as c, users as u 
                where p.idwriter=u.id and p.idcategory=c.id and p.status = '${status}' 
                and p.isDelete = false and c.isDelete = false`;
    return db.load(sql);
  },

  allWithStatusTime: compare => {
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id
    and p.isDelete = false and c.isDelete = false 
    and p.status = 'accept' and p.publicationDate ${compare} current_timestamp`;
    return db.load(sql);
  },

  numberByStatus: status => {
    var sql = `select count(*) as num from posts where status = '${status}' and isDelete = false`;
    return db.load(sql);
  },

  numberByStatusTime: compare => {
    var sql = `select count(*) as num 
    from posts 
    where status = 'accept' and isDelete = false and publicationDate ${compare} current_timestamp`;
    return db.load(sql);
  },
  // pageByCat: (idcat, offset, limit) => {
  //   var sql = `select p.*, u.fullname as writer, urlavatar, c.name as category, u.urlavatar
  //   from posts as p, categories as c, users as u
  //   where p.idwriter=u.id and p.idcategory=c.id and p.idcategory = ${idcat}
  //   limit ${limit} offset ${offset}`; // and p.idcategory=${idcat}
  //   return db.load(sql);
  // },
  // numByCat: idcat => {
  //   var sql = `select count(*) as total from posts where idcategory=${idcat}`;
  //   return db.load(sql);
  // },
  addView: idPost => {
    var sql = `update posts set view =view +1 where id=${idPost}`;
    return db.updateSQL(sql);
  },
  pageByCat: async (idcat, offset, limit) => {
    var d = await categoriesmodel.loadSonCat(idcat);
    // console.log(d.rows);
    var cats = d.rows;
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
        from posts as p, categories as c, users as u 
        where p.idwriter=u.id and p.idcategory=c.id and (p.idcategory = ${idcat}`;
    if (cats.length > 0) {
      cats.forEach(cat => {
        sql += ` or p.idcategory = ${cat.id} `;
      });
    }
    sql += `) limit ${limit} offset ${offset}`;
    return db.load(sql);
  },
  numByCat: async idcat => {
    var d = await categoriesmodel.loadSonCat(idcat);
    var cats = d.rows;
    var sql = `select count(*) as total from posts where (idcategory=${idcat}`;
    if (cats.length > 0) {
      cats.forEach(cat => {
        sql += ` or idcategory = ${cat.id} `;
      });
    }
    sql += `)`;
    return db.load(sql);
  },
  pageByTag: async (idTag, offset, limit) => {
    var sql = `select DISTINCT p.*, u.fullname as writer, c.name as category, u.urlavatar
    from posts p, tagpost as tp, categories as c, users as u 
    where p.id=tp.idpost and p.idwriter=u.id and p.idcategory=c.id and tp.idtag=${idTag} 
    limit ${limit} offset ${offset}`;
    return db.load(sql);
  },

  numByTag: async idcat => {
    var sql = `select DISTINCT count(*) as total from posts p, tagpost tp where p.id=tp.idpost and idcategory=${idcat}`;

    return db.load(sql);
  },
};
