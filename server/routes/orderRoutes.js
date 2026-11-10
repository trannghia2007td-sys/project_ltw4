const express = require('express')
const router = express.Router()

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController')

const { protect, adminOnly } = require('../middleware/authMiddleware')

// Khách hàng
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)

// Admin
router.get('/', protect, adminOnly, getAllOrders)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

module.exports = router