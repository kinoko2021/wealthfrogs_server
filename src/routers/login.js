const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');

// POST 请求登录
router.post('/api/login/login', loginController.loginPost);

module.exports = router;