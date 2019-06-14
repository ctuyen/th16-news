var db = require('../utils/db');

module.exports = {
    checkEmail: (email) => {
        var sql = `select * from users where users.email = '${email}'`;
        return db.load(sql);
    },

    checkId: (idUser) => {
        var sql = `select * from users where users.id = '${idUser}'`;
        return db.load(sql);
    },

    getPassword: (email) => {
        var sql = `select password from users where users.email = '${email}'`;
        return db.load(sql);
    },

    getPosition: (idUser) => {
        var sql = `select position from users where users.id = '${idUser}'`;
        return db.load(sql);
    }
}