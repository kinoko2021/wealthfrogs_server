const axios = require("axios");
const { response, json } = require("express");
const db = require('../common/database');
const rq = require('../common/request')

exports.loginPost = (req, res) => {
    let params = req.body;
    const querySql = `select * from \`user\` where \`id\` = ? and \`password\` = ?`;
    db.query(querySql, [params.userId, params.password])
    .then((result) => {
        if (result.length === 1) {
            res.json({status: 'ok'});
        }
        else {
            throw new Error('账号或密码错误');
        }
    }).catch((error) => {
        res.json({status: 'error', message: error.message});
    })
}
