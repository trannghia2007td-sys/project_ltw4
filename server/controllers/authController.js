const bcrypt = require('bcryptjs')
const User = require('../models/User')
const generateToken = require('../utils/generateToken')

// Đăng ký tài khoản
const register = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.',
      })
    }

    const normalizedUsername = username.trim()

    if (normalizedUsername.length < 3 || normalizedUsername.length > 30) {
      return res.status(400).json({
        message: 'Tên đăng nhập phải từ 3 đến 30 ký tự.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Mật khẩu phải có ít nhất 6 ký tự.',
      })
    }

    const existingUser = await User.findOne({
      username: normalizedUsername,
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Tên đăng nhập đã tồn tại.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
      role: 'customer',
    })

    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công.',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Tên đăng nhập đã tồn tại.',
      })
    }

    console.error('Register error:', error)

    return res.status(500).json({
      message: 'Lỗi máy chủ khi đăng ký tài khoản.',
    })
  }
}

// Đăng nhập
const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.',
      })
    }

    const user = await User.findOne({
      username: username.trim(),
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password,
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
      })
    }

    const token = generateToken(user)

    return res.status(200).json({
      message: 'Đăng nhập thành công.',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    return res.status(500).json({
      message: 'Lỗi máy chủ khi đăng nhập.',
    })
  }
}

module.exports = {
  register,
  login,
}