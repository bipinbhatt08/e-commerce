const express= require('express')
const { createOrder } = require('../controllers/order.controller')
const router = express.Router()
router.route('/orders').post(createOrder)
module.exports = router