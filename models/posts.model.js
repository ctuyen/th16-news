var db = require("../utils/db");
var categoriesmodel = require("./categories.model");

function change_alias(alias) {
  var str = alias;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
}

module.exports = {
  all: () => {
    return db.load("select * from posts where isDelete = false");
  },
  topSlide: () => {
    var sql = `SELECT p.id, title, summary,urlthumbnail, p.idcategory, c.name category
    from posts p, categories c
    where publicationDate between (CURRENT_TIMESTAMP - INTERVAL '7 day') and CURRENT_TIMESTAMP and p.idcategory=c.id and p.isDelete = false
    order by view desc
    limit 4`;
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
      `select p.*, c.name as category from posts as p, categories as c where p.idcategory = c.id and p.isDelete = false order by view desc limit ${limit}`
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
    and p.isDelete = false and c.isDelete = false
    order by publicationDate desc`;
    return db.load(sql);
  },
  allByCat: id => {
    return db.load(
      `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id and p.idCategory = ${id} 
    and p.status = 'draft' and p.isDelete = false and c.isDelete = false
    order by writingDate desc`
    );
  },

  allByIdEditor: (id, status) => {
    return db.load(
      `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id and p.idEditor = ${id} 
    and p.status = '${status}' and p.isDelete = false and c.isDelete = false`
    );
  },

  checkPremium: id => {
    return db.load(
      `select ispremium from posts where id = ${id} and isDelete = false`
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
    where cm.iduser = u.id and cm.idpost = ${id}
    order by commentDate desc`;
    return db.load(sql);
  },

  allWithStatus: (idwriter,status) => {
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
                from posts as p, categories as c, users as u 
                where p.idwriter=u.id and p.idcategory=c.id and p.status = '${status}' and idwriter = ${idwriter}
                and p.isDelete = false and c.isDelete = false
                order by writingDate desc`;
    return db.load(sql);
  },

  allWithStatusTime: (idwriter,compare) => {
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id
    and p.isDelete = false and c.isDelete = false and idwriter = ${idwriter}
    and p.status = 'accept' and p.publicationDate ${compare} current_timestamp
    order by publicationDate desc`;
    return db.load(sql);
  },

  numberByStatus:(idWriter, status) => {
    var sql = `select count(*) as num from posts where  isDelete = false and status = '${status}' and idwriter = ${idWriter}`;
    return db.load(sql);
  },

  numberByStatusTime: (idWriter,compare) => {
    var sql = `select count(*) as num 
    from posts 
    where status = 'accept' and isDelete = false and idwriter = ${idWriter} and publicationDate ${compare} current_timestamp`;
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
        where p.idwriter=u.id and p.idcategory=c.id and p.isdelete = false and (p.idcategory = ${idcat}`;
    if (cats.length > 0) {
      cats.forEach(cat => {
        sql += ` or p.idcategory = ${cat.id} `;
      });
    }
    sql += `)order by publicationDate desc limit ${limit} offset ${offset}`;
    return db.load(sql);
  },
  pageByCats: async (idpost, idcat, offset, limit) => {
    var d = await categoriesmodel.loadSonCat(idcat);
    // console.log(d.rows);
    var cats = d.rows;
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
        from posts as p, categories as c, users as u 
        where p.idwriter=u.id and p.idcategory=c.id and p.isdelete = false and (p.idcategory = ${idcat}
          and p.id<>${idpost}
          `;
    if (cats.length > 0) {
      cats.forEach(cat => {
        sql += ` or p.idcategory = ${cat.id} `;
      });
    }
    sql += `)order by publicationDate desc limit ${limit} offset ${offset}`;
    return db.load(sql);
  },
  numByCat: async idcat => {
    var d = await categoriesmodel.loadSonCat(idcat);
    var cats = d.rows;
    var sql = `select count(*) as total from posts where isdelete = false and (idcategory=${idcat}`;
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
    where p.id=tp.idpost and p.idwriter=u.id and p.idcategory=c.id and tp.idtag=${idTag} and p.isdelete = false
    order by publicationDate desc
    limit ${limit} offset ${offset}`;
    return db.load(sql);
  },

  numByTag: async idtag => {
    var sql = `select count(*) as total from posts p, tagpost tp where p.id=tp.idpost and idtag=${idtag} and p.isdelete = false`;

    return db.load(sql);
  },
  searchPosts: key => {
    var t = change_alias(key);
    var tt = t.replace(/ /g, " & ");
    console.log(tt);
    var sql = `select p.* from posts as p, (SELECT pid, ptitle
      FROM (SELECT id as pid,
                   title as ptitle,
                   setweight(to_tsvector(coalesce(convertTVkdau(title))), 'A') || 
                   setweight(to_tsvector(coalesce(convertTVkdau(summary))), 'B')|| 
                   setweight(to_tsvector(coalesce(convertTVkdau(content))), 'D') as document
            FROM posts GROUP BY id) p_search
      WHERE p_search.document @@ to_tsquery('${tt}')
      ORDER BY ts_rank(p_search.document, to_tsquery('${tt}')) DESC) as t
    where p.id = t.pid and p.isdelete = false`;
    return db.load(sql);
  },

  addComment: entity => {
    return db.add("comment", entity);
  },
  load3pre: () => {
    var sql = `select p.*, u.fullname as writer, c.name as category, u.urlavatar 
    from posts as p, categories as c, users as u 
    where p.idwriter=u.id and p.idcategory=c.id and p.isdelete = false and ispremium=true and status ='accept'
    order by publicationDate desc
    limit 3`;
    return db.load(sql);
  }
};
