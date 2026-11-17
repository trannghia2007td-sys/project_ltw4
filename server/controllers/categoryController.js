
const Category = require('../models/Category')
const Book = require('../models/Book')

// Lấy danh sách danh mục
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể tải danh sách danh mục',
    })
  }
}

// Thêm danh mục
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body

    if (!name?.trim() || !slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên và mã danh mục',
      })
    }

    const normalizedSlug = slug.trim().toLowerCase()

    const category = await Category.create({
      name: name.trim(),
      slug: normalizedSlug,
    })

    res.status(201).json({
      success: true,
      message: 'Thêm danh mục thành công',
      category,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Tên hoặc mã danh mục đã tồn tại',
    })
  }
}

// Cập nhật danh mục
const updateCategory = async (req, res) => {
  try {
    const { name, slug } = req.body

    if (!name?.trim() || !slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên và mã danh mục',
      })
    }

    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      })
    }

    const normalizedSlug = slug.trim().toLowerCase()

    // Nếu đổi mã danh mục, cập nhật mã của các sách liên quan
    if (category.slug !== normalizedSlug) {
      const existingCategory = await Category.findOne({
        slug: normalizedSlug,
        _id: { $ne: category._id },
      })

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Mã danh mục đã tồn tại',
        })
      }

      await Book.updateMany(
        { category: category.slug },
        { $set: { category: normalizedSlug } },
      )
    }

    category.name = name.trim()
    category.slug = normalizedSlug

    await category.save()

    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      category,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Không thể cập nhật danh mục',
    })
  }
}

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      })
    }

    const bookCount = await Book.countDocuments({
      category: category.slug,
    })

    if (bookCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa vì còn ${bookCount} sách thuộc danh mục này`,
      })
    }

    await category.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa danh mục',
    })
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}
