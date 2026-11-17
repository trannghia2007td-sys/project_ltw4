
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type OrderItem = {
  bookId: string
  title: string
  image: string
  price: number
  quantity: number
}

type Order = {
  _id: string
  customerName: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

function Orders() {
  const { user } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + 'đ'

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('vi-VN')

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'processing':
        return 'Đang xử lý'
      case 'shipped':
        return 'Đang giao hàng'
      case 'delivered':
        return 'Đã giao hàng'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return 'Không xác định'
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('bookhaven-token')

        if (!token) {
          setError('Vui lòng đăng nhập để xem đơn hàng.')
          return
        }

        const response = await fetch(
          'http://localhost:5000/api/orders/my-orders',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Không thể tải đơn hàng.')
        }

        setOrders(data.orders || [])
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi khi tải đơn hàng.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (user?.role === 'admin') {
    return (
      <div className="page-container">
        <h1>Lịch sử đơn hàng</h1>
        <p>Tài khoản quản trị vui lòng xem đơn hàng tại trang quản trị.</p>
        <Link to="/admin">Đi đến trang quản trị</Link>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1>Đơn hàng của tôi</h1>

      {loading ? (
        <p>Đang tải danh sách đơn hàng...</p>
      ) : error ? (
        <p>{error}</p>
      ) : orders.length === 0 ? (
        <div>
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-item" key={order._id}>
              <div className="order-header">
                <div>
                  <h3>Mã đơn hàng: {order._id}</h3>
                  <p>Ngày đặt: {formatDate(order.createdAt)}</p>
                </div>

                <strong>{getStatusText(order.status)}</strong>
              </div>

              <div className="order-products">
                {order.items.map((item, index) => (
                  <div
                    className="order-product"
                    key={`${order._id}-${item.bookId}-${index}`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    <div>
                      <h4>{item.title}</h4>
                      <p>Đơn giá: {formatPrice(item.price)}</p>
                      <p>Số lượng: {item.quantity}</p>
                    </div>

                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <span>Tổng thanh toán:</span>
                <strong>{formatPrice(order.totalAmount)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
