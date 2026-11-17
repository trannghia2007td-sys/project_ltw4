
const Book = require('../models/Book')
const Category = require('../models/Category')

// Kiểm tra dữ liệu sách
const validateBookData = async (data) => {
  const { title, author, price, category } = data

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof author !== 'string' ||
    !author.trim() ||
    price === undefined ||
    price === null ||
    category === undefined ||
    category === null ||
    typeof category !== 'string' ||
    !category.trim()
  ) {
    return {
      valid: false,
      message: 'Vui lòng nhập đầy đủ tên sách, tác giả, giá và thể loại',
    }
  }

  const normalizedPrice = Number(price)

  if (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0) {
    return {
      valid: false,
      message: 'Giá sách phải là số lớn hơn 0',
    }
  }

  const normalizedCategory = category.trim().toLowerCase()

  const existingCategory = await Category.findOne({
    slug: normalizedCategory,
  })

  if (!existingCategory) {
    return {
      valid: false,
      message: 'Danh mục sách không tồn tại. Vui lòng chọn danh mục hợp lệ',
    }
  }

  return {
    valid: true,
    data: {
      title: title.trim(),
      author: author.trim(),
      price: normalizedPrice,
      category: normalizedCategory,
      image: typeof data.image === 'string' ? data.image.trim() : '',
      label: typeof data.label === 'string' ? data.label.trim() : '',
    },
  }
}

// Lấy danh sách sách
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể tải danh sách sách',
    })
  }
}

// Admin thêm sách
const createBook = async (req, res) => {
  try {
    const validation = await validateBookData(req.body)

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      })
    }

    const newBook = await Book.create(validation.data)

    res.status(201).json({
      success: true,
      message: 'Thêm sách thành công',
      book: newBook,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Không thể thêm sách',
    })
  }
}

// Admin cập nhật sách
const updateBook = async (req, res) => {
  try {
    const validation = await validateBookData(req.body)

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      })
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      validation.data,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách cần cập nhật',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật sách thành công',
      book: updatedBook,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Không thể cập nhật sách',
    })
  }
}

// Admin xóa sách
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id)

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách cần xóa',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Xóa sách thành công',
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Không thể xóa sách',
    })
  }
}

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
}
