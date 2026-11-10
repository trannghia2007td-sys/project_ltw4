const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
)

app.use(express.json())

// Kiểm tra server
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Online Bookstore API is running',
  })
})

// API xác thực
app.use('/api/auth', authRoutes)

// API sách
app.use('/api/books', bookRoutes)

// API đơn hàng
app.use('/api/orders', orderRoutes)

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found',
  })
})

module.exports = app