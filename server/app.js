
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const orderRoutes = require('./routes/orderRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

// Cấu hình CORS cho frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
]

app.use(
  cors({
    origin: allowedOrigins,
  }),
)

// Đọc dữ liệu JSON
app.use(express.json())

// Kiểm tra API
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Online Bookstore API is running',
  })
})

// Các API
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)

// Xử lý API không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  })
})

module.exports = app
