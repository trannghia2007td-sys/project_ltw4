
const express = require('express')
const router = express.Router()

const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController')

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware')

// Tất cả API trong file này đều yêu cầu quyền Admin
router.use(protect, adminOnly)

router.get('/', getUsers)
router.put('/:id/role', updateUserRole)
router.delete('/:id', deleteUser)

module.exports = router
