const mongoose = require('mongoose')
const Order = require('../models/Order')
const Book = require('../models/Book')

// Khách hàng tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
  return res.status(403).json({
    message: 'Chỉ khách hàng mới được phép đặt hàng.',
  })
}
    const { items } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Giỏ hàng đang trống.',
      })
    }

    // Kiểm tra mã sách và số lượng
    for (const item of items) {
      if (
        !mongoose.Types.ObjectId.isValid(item.bookId) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          message: 'Thông tin sản phẩm không hợp lệ.',
        })
      }
    }

    // Lấy thông tin sách từ database
    const bookIds = items.map((item) => item.bookId)
    const books = await Book.find({ _id: { $in: bookIds } })

    if (books.length !== new Set(bookIds.map(String)).size) {
      return res.status(400).json({
        message: 'Một hoặc nhiều sản phẩm không còn tồn tại.',
      })
    }

    // Tạo danh sách sản phẩm trong đơn hàng
    const orderItems = items.map((item) => {
      const book = books.find(
        (book) => String(book._id) === String(item.bookId),
      )

      return {
        bookId: book._id,
        title: book.title,
        image: book.image,
        price: book.price,
        quantity: Number(item.quantity),
      }
    })

    // Tính tổng tiền dựa trên giá trong database
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    const order = await Order.create({
      customerId: req.user._id,
      customerName: req.user.username,
      items: orderItems,
      totalAmount,
    })

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công.',
      order,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Không thể tạo đơn hàng.',
      error: error.message,
    })
  }
}

// Khách hàng xem đơn hàng của mình
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.user._id,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Không thể lấy danh sách đơn hàng.',
      error: error.message,
    })
  }
}

// Admin xem tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'username email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Không thể lấy danh sách đơn hàng.',
      error: error.message,
    })
  }
}

// Admin cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Trạng thái đơn hàng không hợp lệ.',
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    )

    if (!order) {
      return res.status(404).json({
        message: 'Không tìm thấy đơn hàng.',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công.',
      order,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Không thể cập nhật đơn hàng.',
      error: error.message,
    })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
}