const { Pool, Client } = require('pg')
const connectionString = 'postgres://lsfbyeuy:8WQuuiEfF7GgH7kYBM3lhH9OyW_6TNyy@satao.db.elephantsql.com:5432/lsfbyeuy';

var createConnection = () => {
  return new Client({
    connectionString: connectionString,
  });
};

module.exports = {
  load: sql => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();
      connection.query(sql, (error, results, fields) => {
        if (error) reject(error);
        else resolve(results);
        //console.log(results);
        connection.end();
      });
    });
  },

  add: (tableName, entity) => {
    return new Promise((resolve, reject) => {
      var sql = `insert into ${tableName} set ?`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, entity, (error, value) => {
        if (error) reject(error);
        else resolve(value.insertId);
        //console.log(results);
        connection.end();
      });
    });
  },

  update: (tableName, idField, entity) => {
    return new Promise((resolve, reject) => {
      var id = entity[idField];
      delete entity[idField];
      
      var sql = `update ${tableName} set ? where ${idField} = ?`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, [entity, id], (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value.changedRows);
        }
        connection.end();
      });
    });
  },
};
