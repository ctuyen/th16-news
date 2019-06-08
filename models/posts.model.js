var db = require('../utils/db');

module.exports = {
    all: ()=>{
        return db.load('select * from posts');
    },

    allByCat: id =>{
        return db.load(`select * from posts where idCategory = ${id}`);
    },

    single: id =>{
        return db.load(`select * from posts where id = ${id}`);
    },

    add: entity =>{
        return db.add('posts',entity);
    },

    update: entity =>{
        return db.update('posts','id', entity);
    },

    delete: id =>{
        return db.delete('posts','id', id);
    },
};
