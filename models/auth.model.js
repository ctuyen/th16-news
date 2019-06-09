var db = require('../utils/db');

module.exports = {
    checkEmail: (email) => {
        var sql =`select * from users where users.email = '${email}'`;
        return db.load(sql);
    },

    checkId: (idUser) => {
        var sql = `select * from users where users.id = '${idUser}'`;
        return db.load(sql);
    }

    // checkPassword: (email, password) => {
    //     var sql =`select * from users where users.email = '${email}' and password = '${password}'`;
    //     return db.load(sql);    
    // }
}
