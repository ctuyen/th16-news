const {
  Pool,
  Client
} = require("pg");
const connectionString =
  "postgres://lsfbyeuy:8WQuuiEfF7GgH7kYBM3lhH9OyW_6TNyy@satao.db.elephantsql.com:5432/lsfbyeuy";

var createConnection = () => {
  return new Client({
    connectionString: connectionString
  });
};

module.exports = {
  load: sql => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();
      connection.query(sql, (error, results) => {
        if (error) reject(error);
        else resolve(results);
        //   console.log(results.rows);
        connection.end();
      });
    });
  },
  add: (table, entity) => {
    var sql = `insert into ${table}`;
    var cols = "(";
    var numCols = "(";
    Object.keys(entity).forEach((key, i) => {
      cols += ` ${key},`;
      numCols += ` $${i + 1},`;
    });
    sql += cols;
    sql = sql.substr(0, sql.length - 1);
    sql += ") values ";
    sql += numCols;
    sql = sql.substr(0, sql.length - 1);
    sql += ") RETURNING *";
    // console.log(sql);
    var values = Object.keys(entity).map(key => {
      return entity[key];
    });
    // console.log(values);

    var connection = createConnection();
    connection.connect();
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) reject(error);
        else resolve(results);
        // console.log(results);
        connection.end();
      });
    });
  },
  updateSQL: sql=>{
    var connection = createConnection();
    connection.connect();
    return new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (error) reject(error);
        else resolve(results);
        connection.end();
      });
    });
  }
  ,
  update: (table, entity) => {
    var sql = `update ${table} set`;
    Object.keys(entity).forEach((key, i) => {
      sql += ` ${key} = $${i + 1},`;
    });
    sql = sql.substr(0, sql.length - 1);
    sql += ` where id = ${entity.id} RETURNING *`;
    //   console.log(sql);
    var values = Object.keys(entity).map(key => {
      return entity[key];
    });

    //   console.log(values);
    var connection = createConnection();
    connection.connect();
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) reject(error);
        else resolve(results);
        // console.log(results);
        connection.end();
      });
    });
  },
  delete: (tableName, idField, id) => {
    return new Promise((resolve, reject) => {
      var sql = `delete from ${tableName} where ${idField} = ${id}`;
      var connection = createConnection();
      connection.connect();
      connection.query(sql, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
        connection.end();
      });
    });
  }
};