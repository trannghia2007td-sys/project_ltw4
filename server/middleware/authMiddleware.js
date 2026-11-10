const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Kiểm tra người dùng đã đăng nhập
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Vui lòng đăng nhập để tiếp tục.',
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'Tài khoản không còn tồn tại.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn.',
    })
  }
}

// Chỉ cho phép Admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }

  return res.status(403).json({
    message: 'Bạn không có quyền truy cập chức năng này.',
  })
}

module.exports = {
  protect,
  adminOnly,
}