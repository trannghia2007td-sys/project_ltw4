
require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Book = require('./models/Book')

// 25 cuốn sách mẫu, chia đều thành 5 danh mục
const sampleBooks = [
  // 1. VĂN HỌC
  {
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    price: 79000,
    category: 'van-hoc',
    image: '',
    label: 'Bán chạy',
  },
  {
    title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
    author: 'Nguyễn Nhật Ánh',
    price: 95000,
    category: 'van-hoc',
    image: '',
    label: 'Sách nổi bật',
  },
  {
    title: 'Mắt Biếc',
    author: 'Nguyễn Nhật Ánh',
    price: 85000,
    category: 'van-hoc',
    image: '',
    label: '',
  },
  {
    title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
    author: 'Nguyễn Nhật Ánh',
    price: 75000,
    category: 'van-hoc',
    image: '',
    label: '',
  },
  {
    title: 'Rừng Na Uy',
    author: 'Haruki Murakami',
    price: 120000,
    category: 'van-hoc',
    image: '',
    label: '',
  },

  // 2. TRUYỆN TRANH
  {
    title: 'Doraemon - Tập 1',
    author: 'Fujiko F. Fujio',
    price: 25000,
    category: 'truyen-tranh',
    image: '',
    label: 'Tuổi thơ',
  },
  {
    title: 'Thám Tử Lừng Danh Conan - Tập 1',
    author: 'Gosho Aoyama',
    price: 22000,
    category: 'truyen-tranh',
    image: '',
    label: '',
  },
  {
    title: 'One Piece - Tập 1',
    author: 'Eiichiro Oda',
    price: 25000,
    category: 'truyen-tranh',
    image: '',
    label: '',
  },
  {
    title: 'Dragon Ball - Tập 1',
    author: 'Akira Toriyama',
    price: 25000,
    category: 'truyen-tranh',
    image: '',
    label: '',
  },
  {
    title: 'Shin - Cậu Bé Bút Chì - Tập 1',
    author: 'Yoshito Usui',
    price: 20000,
    category: 'truyen-tranh',
    image: '',
    label: '',
  },

  // 3. THIẾU NHI
  {
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    price: 65000,
    category: 'thieu-nhi',
    image: '',
    label: 'Kinh điển',
  },
  {
    title: 'Tuổi Thơ Dữ Dội',
    author: 'Phùng Quán',
    price: 110000,
    category: 'thieu-nhi',
    image: '',
    label: '',
  },
  {
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    price: 60000,
    category: 'thieu-nhi',
    image: '',
    label: '',
  },
  {
    title: 'Alice Ở Xứ Sở Diệu Kỳ',
    author: 'Lewis Carroll',
    price: 70000,
    category: 'thieu-nhi',
    image: '',
    label: '',
  },
  {
    title: 'Kính Vạn Hoa - Tập 1',
    author: 'Nguyễn Nhật Ánh',
    price: 55000,
    category: 'thieu-nhi',
    image: '',
    label: '',
  },

  // 4. KHOA HỌC
  {
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    price: 135000,
    category: 'khoa-hoc',
    image: '',
    label: 'Khám phá',
  },
  {
    title: 'Lược Sử Thời Gian',
    author: 'Stephen Hawking',
    price: 125000,
    category: 'khoa-hoc',
    image: '',
    label: '',
  },
  {
    title: 'Gen: Lịch Sử Và Tương Lai Của Nhân Loại',
    author: 'Siddhartha Mukherjee',
    price: 180000,
    category: 'khoa-hoc',
    image: '',
    label: '',
  },
  {
    title: 'Vạn Vật Vận Hành Như Thế Nào',
    author: 'David Macaulay',
    price: 150000,
    category: 'khoa-hoc',
    image: '',
    label: '',
  },
  {
    title: 'Lược Sử Loài Người',
    author: 'Yuval Noah Harari',
    price: 160000,
    category: 'khoa-hoc',
    image: '',
    label: '',
  },

  // 5. KỸ NĂNG
  {
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    price: 85000,
    category: 'ky-nang',
    image: '',
    label: 'Phổ biến',
  },
  {
    title: '7 Thói Quen Hiệu Quả',
    author: 'Stephen R. Covey',
    price: 120000,
    category: 'ky-nang',
    image: '',
    label: '',
  },
  {
    title: 'Atomic Habits - Thay Đổi Tí Hon, Hiệu Quả Bất Ngờ',
    author: 'James Clear',
    price: 110000,
    category: 'ky-nang',
    image: '',
    label: 'Bán chạy',
  },
  {
    title: 'Tư Duy Nhanh Và Chậm',
    author: 'Daniel Kahneman',
    price: 145000,
    category: 'ky-nang',
    image: '',
    label: '',
  },
  {
    title: 'Nghĩ Giàu Và Làm Giàu',
    author: 'Napoleon Hill',
    price: 90000,
    category: 'ky-nang',
    image: '',
    label: '',
  },
]

// Tìm ảnh bìa sách từ Open Library
const getBookImage = async (title, author) => {
  try {
    // Thử tìm theo tên sách và tác giả trước
    const queries = [
      `${title} ${author}`,
      title.replace(/\s*-\s*Tập\s*\d+/i, ''),
    ]

    for (const query of queries) {
      const url = new URL('https://openlibrary.org/search.json')

      url.searchParams.set('q', query)
      url.searchParams.set('fields', 'title,author_name,cover_i')
      url.searchParams.set('limit', '10')

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.docs || data.docs.length === 0) {
        continue
      }

      const bookWithCover = data.docs.find(book => book.cover_i)

      if (bookWithCover) {
        console.log(`Tìm thấy: ${bookWithCover.title}`)

        return `https://covers.openlibrary.org/b/id/${bookWithCover.cover_i}-L.jpg`
      }
    }

    return ''
  } catch (error) {
    console.log(`Lỗi tìm ảnh ${title}:`, error.message)
    return ''
  }
}
const seedBooks = async () => {
  try {
    await connectDB()

    let addedCount = 0
    let updatedCount = 0
    let missingCount = 0

    for (const book of sampleBooks) {
       console.log(`Đang tìm ảnh: ${book.title}`)

    // Chờ 1 giây để tránh gửi yêu cầu quá nhanh
       await new Promise(resolve => setTimeout(resolve, 1100))
      const image = await getBookImage(book.title, book.author)

      // Kiểm tra sách đã có trong database chưa
      const existingBook = await Book.findOne({
        title: book.title,
        author: book.author,
      })

      if (existingBook) {
        // Chỉ bổ sung ảnh nếu sách chưa có ảnh
        if (!existingBook.image && image) {
          existingBook.image = image
          await existingBook.save()
          updatedCount++
        }
      } else {
        // Thêm sách mới vào database
        await Book.create({
          ...book,
          image,
        })
        addedCount++
      }

      if (!image) {
        missingCount++
        console.log(`Chưa tìm thấy ảnh cho: ${book.title}`)
      }
    }

    console.log('-----------------------------')
    console.log(`Đã thêm sách mới: ${addedCount}`)
    console.log(`Đã cập nhật ảnh: ${updatedCount}`)
    console.log(`Sách chưa tìm thấy ảnh: ${missingCount}`)
    console.log('Hoàn tất cập nhật dữ liệu!')
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu sách:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
    console.log('Đã đóng kết nối MongoDB.')
  }
}

seedBooks()