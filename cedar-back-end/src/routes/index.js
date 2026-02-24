const express = require('express');
// 引入所有子路由
const userRouter = require('./user');
const emailRouter = require('./email');

const router = express.Router();
router.use('/user', userRouter);
router.use('/email', emailRouter);

module.exports = router;