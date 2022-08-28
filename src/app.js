const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(express.json({type: 'application/json'}));

// 导入路由
const choiceRouter = require('./routers/choice');
const orderRouter = require('./routers/order');
const loginRouter = require('./routers/login');

app.use('/', choiceRouter);
app.use('/', orderRouter);
app.use('/', loginRouter);


app.listen(8000, () => {
  console.log('WealthFrogs 服务端启动')
});