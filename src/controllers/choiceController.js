const axios = require("axios");
const { response, json } = require("express");
const db = require('../common/database');
const rq = require('../common/request')

const bourseMap = {
    "1": "sh",
    "51": "sz",
    "100": "hk",
    "200": "us",
}

const parseChoiceStock = (infoStr) => {
    let info = infoStr.split('\"')[1].split('\~');
    return {
        stock_id: bourseMap[info[0]] + info[2],
        name: info[1],
        price: parseFloat(info[3]),
        fluctuation: parseFloat(info[4]),
        fluctuation_ratio: parseFloat(info[5]),
    }
}

const parseDetail = (infoStr) => {
    let info = infoStr.split('\"')[1].split('\~');
    try {
        return {
            stock_id: bourseMap[info[0]] + info[2],
            name: info[1],
            price: parseFloat(info[3]),
            closing_price: parseFloat(info[4]),
            opening_price: parseFloat(info[5]),
            volume: parseInt(info[6]),
            foreign: parseInt(info[7]),
            domestic: parseInt(info[8]),
            buy_level:[[info[9],info[10]],[info[11],info[12]],[info[13],info[14]],[info[15],info[16]],[info[17],info[18]]],
            sell_level:[[info[19],info[20]],[info[21],info[22]],[info[23],info[24]],[info[25],info[26]],[info[27],info[28]]],
            fluctuation: parseFloat(info[31]),
            fluctuation_ratio: parseFloat(info[32]),
            top_price: parseFloat(info[33]),
            bottom_price: parseFloat(info[34]),
            turnover_rate: parseFloat(info[38]),
            ttm: parseFloat(info[39]),
            max_price: parseFloat(info[47]),
            min_price: parseFloat(info[48])
        }
    } catch (error) {
        throw new Error("parse error");
    }
    
}


// 由 GET 查询所有自选股
exports.choiceQueryAllGet = (req, res) => {
    const sql = 'SELECT `stock_id` from `choice` where `user_id` = ?';
    db.query(sql, [123]).then((results) => {
        Promise.all(results.map(result => 
            rq.request(`http://qt.gtimg.cn/q=s_${result.stock_id}`, 'GET')))
        .then((data) => {
            res.json({status: 'ok', result: data.map(d => parseChoiceStock(d))});
        }).catch((e) => {
            res.json({status: 'error'});
        })
    }).catch((err) => {
        res.json({status: 'error', message: 'sql failed'});
    });
};

// 由 GET 删除自选股
exports.choiceDeleteGet = (req, res) => {
    const sql = `DELETE from \`choice\` where \`stock_id\` = ? and \`user_id\` = ?`;
    db.query(sql, [req.query.stockId, 123]).then((result) => {
        res.json({status: 'ok'});
    }).catch((error) => {
        res.json({status: 'error', message: 'sql failed'});
    });
};


exports.choiceAddGet = (req, res) => {
    rq.request(`http://qt.gtimg.cn/q=s_${req.query.stockId}`, 'GET')
    .then((response) => {
        if (response.split('=')[0] === "v_pv_none_match") {
            throw new Error('证券代码输入错误');
        } 
    }).then(() => {
        const querySql = `SELECT \`stock_id\` from \`choice\` where \`user_id\` = ? and \`stock_id\` = ?`;
        return db.query(querySql,  [123, req.query.stockId])
    }).then((result) => {
        if (result.length !== 0) {
            throw new Error('已添加过该自选股');
        } else {
            const sql = `INSERT INTO choice (user_id, stock_id) VALUES (?, ?)`;
            return db.query(sql, [123, req.query.stockId]);
        }
    }).then((result) => {
        res.json({status: 'ok'});
    })
    .catch((err) => {
        res.json({status: 'error', message:err.message});
    });
};

exports.choiceShowDetailGet = (req, res) => {
    rq.request(`http://qt.gtimg.cn/q=${req.query.stockId}`, 'GET')
    .then((response) => {
        if (response.split('=')[0] === "v_pv_none_match") {
            res.json({status:'error', message:'none match stock'});
        }
        let result = parseDetail(response);
        if (typeof result === 'string' && result === 'parse error') {
            res.json({status:'error', message:'parse error'});
        } else {
            res.json({status: 'ok', result: result})
        }
    }).catch((err) => {
        res.json({status:'error', message:'tx api failed'});
    })
}

exports.choiceShowMinuteGet = (req, res) => {
    rq.request(`https://web.ifzq.gtimg.cn/appstock/app/minute/query?code=${req.query.stockId}`, 'GET')
    .then((response) => {
        const resJson = JSON.parse(response);
        let minutes = resJson['data'][req.query.stockId]['data']['data'];
        minutes = minutes.map((record) => {
            let r = record.split(' ');
            return [r[0], r[1]];
        });
        res.json({status: 'ok', result: minutes});
    }).catch((err) => {
        res.json({status:'error', message:'tx api failed'});
    }) ;
}

exports.choiceCheckStockIdGet = (req, res) => {
    rq.request(`http://qt.gtimg.cn/q=${req.query.stockId}`, 'GET')
    .then((response) => {
        if (response.split('=')[0] === "v_pv_none_match") {
            res.json({status:'ok', message:'false'});
        } else {
            res.json({status:'ok', message:'true'});
        }
    }).catch((error) => {
        res.json({status: 'error', message: error.message});
    }) 
}
