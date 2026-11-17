
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    // Tài khoản khách hàng đặt hàng
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Tên người nhận hàng
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Số điện thoại người nhận
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Địa chỉ giao hàng
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      enum: ['cod', 'vietqr'],
      default: 'cod',
      required: true,
    },

    // Danh sách sản phẩm
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          default: '',
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // Tổng tiền đơn hàng
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Trạng thái đơn hàng
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Order', orderSchema)
