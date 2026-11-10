const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tên sách không được để trống'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Tên tác giả không được để trống'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Giá sách không được để trống'],
      min: [0, 'Giá sách không được âm'],
    },
    category: {
      type: String,
      required: true,
      enum: ['van-hoc', 'truyen-tranh', 'thieu-nhi', 'khoa-hoc', 'ky-nang'],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    label: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Book', bookSchema)