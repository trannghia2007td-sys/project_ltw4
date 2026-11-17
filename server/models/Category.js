
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục không được để trống'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Mã danh mục không được để trống'],
      trim: true,
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Category', categorySchema)
