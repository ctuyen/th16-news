var db = require('../utils/db');

module.exports={
    load: () => {
        var sql = 'select * from posts';
        return db.load(sql);
    },
    single: (id)=>{
        var sql = `select * from posts where id = ${id}`;
        return db.load(sql);
    }
}