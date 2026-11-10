const express = require('express')
const router = express.Router()

const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController')

const { protect, adminOnly } = require('../middleware/authMiddleware')

// Ai cũng có thể xem sách
router.get('/', getBooks)

// Chỉ Admin mới được thêm, sửa, xóa sách
router.post('/', protect, adminOnly, createBook)
router.put('/:id', protect, adminOnly, updateBook)
router.delete('/:id', protect, adminOnly, deleteBook)

module.exports = router