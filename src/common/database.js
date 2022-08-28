const mysql = require('mysql');

const pool = mysql.createPool({
    host: "localhost", 
    user: "root", 
    password: "123456", 
    database: "wealthfrogs", 
    port: "3306", 
    multipleStatements: true, 
});


exports.query = function(sql, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
           
            if (err) {
                return reject(err);
            }
            connection.query(sql, params, (errors, results, fields) => {
                // 释放连接
                connection.release();
                if (errors) return reject('服务端Sql执行错误');
                resolve(results);
            });
        });
    });
};

// MySql 事务
exports.transaction = function(sqls, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                return reject(err);
            }
            // 语句和参数数量不匹配
            if (sqls.length !== params.length) {
                connection.release(); // 释放掉
                return reject(new Error("语句与传值不匹配"));
            }

            connection.beginTransaction((beginErr) => {

            if (beginErr) {
                connection.release();
                return reject(beginErr);
            }
            // console.log("开始执行事务，共执行" + sqls.length + "条语句");

            let funcAry = sqls.map((sql, index) => {
                return new Promise((sqlResolve, sqlReject) => {
                    const data = params[index];
                    console.log("data: ", data);
                    connection.query(sql, data, (sqlErr, result) => {
                        console.log('sqlErr: ', sqlErr);
                        console.log('result: ', result);
                        if (sqlErr) {
                        return sqlReject(sqlErr);
                        }
                        sqlResolve(result);
                    });
                });
            });
            Promise.all(funcAry)
                .then((arrResult) => {
                    // 提交事务
                    connection.commit(function (commitErr, info) {
                        if (commitErr) {
                            // console.log("提交事务失败:" + commitErr);
                            // 事务回滚
                            connection.rollback(function (err) {
                                if (err) console.log("回滚失败：" + err);
                                connection.release();
                            });
                            return reject(commitErr);
                        }
        
                        connection.release();
                        resolve(arrResult);
                    });
                })
                .catch((error) => {
                // 多条sql语句执行中 其中有一条报错 直接回滚
                    connection.rollback(function () {
                        // console.log("sql运行失败： " + error);
                        connection.release();
                        reject(error);
                    });
                });
            });
        });
    });
  }
