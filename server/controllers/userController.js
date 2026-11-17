
const User = require('../models/User')
const Order = require('../models/Order')

// Admin xem danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('username role createdAt')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    console.error('Get users error:', error)

    res.status(500).json({
      success: false,
      message: 'Không thể tải danh sách người dùng',
    })
  }
}

// Admin thay đổi quyền người dùng
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Vai trò không hợp lệ',
      })
    }

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      })
    }

    // Không cho Admin tự thay đổi quyền của mình
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Không thể tự thay đổi quyền tài khoản của mình',
      })
    }

    // Không cho hạ quyền Admin cuối cùng
    if (user.role === 'admin' && role === 'customer') {
      const adminCount = await User.countDocuments({
        role: 'admin',
      })

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Không thể hạ quyền Admin cuối cùng',
        })
      }
    }

    user.role = role
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Cập nhật quyền người dùng thành công',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Update user role error:', error)

    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật quyền người dùng',
    })
  }
}

// Admin xóa tài khoản người dùng
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      })
    }

    // Không cho Admin tự xóa tài khoản của mình
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản đang đăng nhập',
      })
    }

    // Không xóa Admin cuối cùng
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({
        role: 'admin',
      })

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa Admin cuối cùng',
        })
      }
    }

    // Bảo vệ lịch sử đơn hàng của người dùng
    const orderCount = await Order.countDocuments({
      customerId: user._id,
    })

    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa vì người dùng còn ${orderCount} đơn hàng`,
      })
    }

    await user.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Xóa tài khoản thành công',
    })
  } catch (error) {
    console.error('Delete user error:', error)

    res.status(500).json({
      success: false,
      message: 'Không thể xóa tài khoản',
    })
  }
}

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
}
