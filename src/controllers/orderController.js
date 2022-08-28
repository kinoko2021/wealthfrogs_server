const axios = require("axios");
const { response, json } = require("express");
const db = require('../common/database');
const rq = require('../common/request')


const makeDeal = (orderId) => {
    let order = null;
    let holding = null;
    let account = null;
    const queryOrderSql = `select * from \`order\` where id = ?`;
    
    db.query(queryOrderSql, [orderId])
    .then((result) => {
        // 查报单
        order = result[0];
        if (order && order.status !== 2 && order.status !== 3) {
            console.log('1111111111111111111111');
            const queryHoldingSql = `select * from \`holding\` where user_id = ? and stock_id = ?`;
            return db.query(queryHoldingSql, [order.user_id, order.stock_id]);
        } else {
            throw new Error("不合法的交易");
        }
    }).then((result) => {
        // 查当前持仓
        holding = result[0];
        const queryAccountSql = `select * from \`user_account\` where id = ?`;
        return db.query(queryAccountSql, [123]);
    })
    .then((result) => {
        account = result[0];
        if (!account) {
            throw new Error('不合法的交易');
        }
        if (order.direction === 0) {
            // buy
            // 1、更新订单状态为已成
            // 2、有持仓 ？更新数量 : 新建持仓 
            // 3、下单阶段已更新账户资金，这里不更新
            const updateOrderSql = `UPDATE \`order\` SET \`status\` = ? , deal = ? WHERE \`id\` = ?`;
            const updateHoldingSql = `UPDATE \`holding\` SET \`payload\` = ? WHERE \`id\` = ?`;
            const insertHoldingSql = `INSERT INTO \`holding\` (user_id, stock_id, payload) VALUES (?, ?, ?)`
            const params = [[4, order.payload, orderId], holding ? [holding.payload + order.payload, holding.id] : [123, order.stock_id, order.payload]];
            return db.transaction([updateOrderSql, holding ? updateHoldingSql : insertHoldingSql], params);
        } else {
            // sell
            // 1、更新订单状态为已成
            // 2、有持仓(一定有) ？更新数量, 定时任务删除 0 持仓
            // 3、更新账户资金
            const updateOrderSql = `UPDATE \`order\` SET \`status\` = ? , deal = ? WHERE \`id\` = ?`;
            const updateAccountSql = `UPDATE \`user_account\` SET \`fund\` = ? WHERE \`id\` = ?`;
            const params = [[4, order.payload, orderId], [account.fund + order.payload * order.price, account.id]];
            return db.transaction([updateOrderSql, updateAccountSql], params);
        } 
    }).then((results) => {
        console.log('make deal succeed');
    }).catch((error) => {
        console.log('make deal error');
    });
}


// 由 GET 撤单
exports.cancelDealGet = (req, res) => {
    const orderId = req.query.orderId;
    let account = null;
    let order = null;
    let holding = null;
    const queryAccountSql = `select * from \`user_account\` where id = ?`;
    db.query(queryAccountSql, [123])
    .then((result) => {
        // 查资金账户
        account = result[0];
        if (!account) {
            throw new Error('撤单失败');
        }
        // 查订单
        const queryOrderSql = `select * from \`order\` where \`id\` = ?`;
        return db.query(queryOrderSql, [orderId]);
    }).then((result) => {
        order = result[0];
        const queryHoldingSql = `select * from \`holding\` where user_id = ? and stock_id = ?`;
        return db.query(queryHoldingSql, [order.user_id, order.stock_id])
    }).then((result) => {
        holding = result[0];
        let newStatus = 2;
        if (order.direction === 0) {
            // buy
            const updateOrderSql = `UPDATE \`order\` SET \`status\` = ? WHERE \`id\` = ?`;
            const updateAccountSql = `UPDATE \`user_account\` SET \`fund\` = ? WHERE \`id\` = ?`;
            return db.transaction([updateOrderSql, updateAccountSql], [[newStatus, orderId], [account.fund + order.price * (order.payload - order.deal), 123]]);
        } else {
            // sell
            const updateOrderSql = `UPDATE \`order\` SET \`status\` = ? WHERE \`id\` = ?`;
            const updateHoldingSql = `UPDATE \`holding\` SET \`payload\` = ? WHERE \`id\` = ?`;
            return db.transaction([updateOrderSql, updateHoldingSql], [[newStatus, orderId], [holding.payload + (order.payload - order.deal), holding.id]]);
        }
    }).then((results) => {
        res.json({status: 'ok'});
    })
    .catch((error) => {
        res.json({status: 'error', message: error});
    })
};


// 由 POST 请求交易
exports.tradePost = (req, res) => {
    /**
     * param:
     * userId token
     * direction 买/卖
     * payload 数量
     * price 价格
     * stockId 股票代码
     */

    let param = req.body;
    let orderId = Math.random().toString(36).slice(-8);
    if (param.direction === 0) {
        // buy
        const queryFundSql = `select \`fund\` from \`user_account\` where \`id\` = ?`;
        db.query(queryFundSql, [123])
        .then((result) => {
            let userAccount = result[0];
            let buyFund = param.payload * param.price;
            if (buyFund <= userAccount.fund){
                const updateFundSql = `UPDATE \`user_account\` SET \`fund\` = ? WHERE \`id\` = ?`;
                const insertOrderSql = `INSERT INTO \`order\` (id, user_id, stock_id, direction, status, payload, deal, price, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                let params = [[userAccount.fund - buyFund, 123], [orderId, 123, param.stockId, 0, 0, parseInt(param.payload), 0, parseFloat(param.price), Date.now()]];
                return db.transaction([updateFundSql, insertOrderSql], params);
            } else {
                throw new Error('资金不足');
            }
        }).then((result => {
            setTimeout(() => {
                makeDeal(orderId);
            }, 1000 * 120);
            res.json({status: 'ok'});
        })).catch((error) => {
            res.json({status: 'error', message: error.message});
        });
    } else {
        // sell
        const queryHoldingSql = `select * from \`holding\` where user_id = ? and stock_id = ?`;
        db.query(queryHoldingSql, [123, param.stockId])
        .then((result) => {
            let holding = result[0];
            if (holding.payload < param.payload) {
                throw new Error('持仓数量不足');
            }
            const insertOrderSql = `INSERT INTO \`order\` (id, user_id, stock_id, direction, status, payload, deal, price, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const updateHoldingSql = `UPDATE \`holding\` SET \`payload\` = ? WHERE \`id\` = ?`;
            let params = [
                [orderId, 123, param.stockId, 1, 0, parseInt(param.payload), 0, parseFloat(param.price), Date.now()],
                [holding.payload - param.payload, holding.id]
            ]
            return db.transaction([insertOrderSql, updateHoldingSql], params);
        }).then((result) => {
            setTimeout(() => {
                makeDeal(orderId);
            }, 1000 * 120);
            res.json({status: 'ok'});
        }).catch((error) => {
            res.json({status: 'error', message: error.message});
        })
    }
};

exports.queryAllOrderGet = (req, res) => {
    const querySql = `SELECT * From \`order\` where \`user_id\` = ?`;
    db.query(querySql, [123]).then((results) => {
        res.json({status: 'ok', result: results});
    }).catch((error) => {
        res.json({status: 'error', message: error});
    })
}