const express = require('express');
const router = express.Router();

const stockController = require('../controllers/choiceController');

// GET 请求查询所有自选股
router.get('/api/choice/queryAll', stockController.choiceQueryAllGet);

// GET 请求删除自选股
router.get('/api/choice/delete', stockController.choiceDeleteGet);

// GET 请求添加自选股
router.get('/api/choice/add', stockController.choiceAddGet);

// GET 请求展示股票详情
router.get('/api/choice/detail', stockController.choiceShowDetailGet)

// GET 请求展示股票分时数据
router.get('/api/choice/minute', stockController.choiceShowMinuteGet)

// GET 请求检查股票代码是否合法
router.get('/api/choice/checkStockId', stockController.choiceCheckStockIdGet)

module.exports = router;