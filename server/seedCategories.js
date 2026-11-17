
require('dotenv').config()

const mongoose = require('mongoose')
const Category = require('./models/Category')

const categories = [
  {
    name: 'Văn học',
    slug: 'van-hoc',
  },
  {
    name: 'Truyện tranh',
    slug: 'truyen-tranh',
  },
  {
    name: 'Thiếu nhi',
    slug: 'thieu-nhi',
  },
  {
    name: 'Khoa học',
    slug: 'khoa-hoc',
  },
  {
    name: 'Kỹ năng',
    slug: 'ky-nang',
  },
]

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('Đã kết nối MongoDB')

    for (const category of categories) {
      await Category.updateOne(
        { slug: category.slug },
        { $setOnInsert: category },
        { upsert: true },
      )
    }

    console.log('Khởi tạo danh mục thành công!')

    const result = await Category.find().sort({ name: 1 })

    console.log('Danh sách danh mục:')

    result.forEach((category) => {
      console.log(`${category.name} - ${category.slug}`)
    })
  } catch (error) {
    console.error('Lỗi khởi tạo danh mục:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

seedCategories()
