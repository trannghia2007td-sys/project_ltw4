const Book = require('../models/Book')

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
    const { title, author, price, category, image, label } = req.body

    if (!title?.trim() || !author?.trim() || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên sách, tác giả, giá và thể loại',
      })
    }

    const newBook = await Book.create({
      title,
      author,
      price,
      category,
      image: image || '',
      label: label || '',
    })

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
    const { title, author, price, category, image, label } = req.body

    if (!title?.trim() || !author?.trim() || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin sách',
      })
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        price,
        category,
        image: image || '',
        label: label || '',
      },
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