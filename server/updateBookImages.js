
require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Book = require('./models/Book')

// Danh sách ảnh bìa cần cập nhật
const bookImages = [
  {
    title: 'Atomic Habits - Thay Đổi Tí Hon, Hiệu Quả Bất Ngờ',
    image: 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_43387.jpg',
  },
  {
    title: 'Nghĩ Giàu Và Làm Giàu',
    image: 'https://sachtiengviet.com/cdn/shop/products/5b85dd797e8e4e105075c87c92afd95d.jpg?v=1699419241',
  },
  {
    title: 'Alice Ở Xứ Sở Diệu Kỳ',
    image: 'https://bizweb.dktcdn.net/thumb/grande/100/370/339/products/alice-o-xs-dieu-ki.jpg?v=1620801759573',
  },
  {
    title: 'Gen: Lịch Sử Và Tương Lai Của Nhân Loại',
    image: 'https://cdn1.fahasa.com/media/catalog/product/b/i/bia-in_lan-1_gene-lich-su-va-tuong-lai-nhan-loai.jpg',
  },
  {
    title: 'Shin - Cậu Bé Bút Chì - Tập 1',
    image: 'https://product.hstatic.net/200000122283/product/shin-cau-be-but-chi-1-ban-dac-biet-5d5bw_09e4c6e80ee14b4090f8ccdac38e6947_master.png',
  },
  {
    title: 'Thám Tử Lừng Danh Conan - Tập 1',
    image: 'https://static3.sachtruyen.com.vn/images/bo-tham-tu-lung-danh-conan-tap-1-ban-nang-cap-1.jpg',
  },
]

const updateBookImages = async () => {
  try {
    await connectDB()

    let successCount = 0

    for (const item of bookImages) {
      const result = await Book.updateOne(
        { title: item.title },
        { $set: { image: item.image } },
      )

      if (result.matchedCount > 0) {
        successCount++
        console.log(`Đã cập nhật ảnh: ${item.title}`)
      } else {
        console.log(`Không tìm thấy sách: ${item.title}`)
      }
    }

    console.log('-----------------------------')
    console.log(`Cập nhật thành công: ${successCount}/${bookImages.length} cuốn`)
  } catch (error) {
    console.error('Lỗi cập nhật ảnh:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
    console.log('Đã đóng kết nối MongoDB.')
  }
}

updateBookImages()
