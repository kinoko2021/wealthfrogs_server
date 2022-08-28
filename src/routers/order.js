const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

// GET 请求撤单
router.get('/api/order/cancel', orderController.cancelDealGet);

// GET 请求交易
router.post('/api/order/trade', orderController.tradePost);

// GET 请求查询所有订单
router.get('/api/order/queryAll', orderController.queryAllOrderGet);

module.exports = router;