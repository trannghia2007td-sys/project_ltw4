
import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ORDER_API_URL = 'http://localhost:5000/api/orders'

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

type PaymentMethod = 'cod' | 'vietqr'

type AdminOrder = {
  _id: string
  customerName: string
  phone?: string
  address?: string
  paymentMethod?: PaymentMethod
  items: {
    bookId: string
    title: string
    price: number
    quantity: number
  }[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
}

function AdminOrders() {
  const { user } = useAuth()

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [message, setMessage] = useState('')
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const token = localStorage.getItem('bookhaven-token')

  // Tải danh sách đơn hàng
  const loadOrders = useCallback(async () => {
    if (!token) {
      setMessage('Vui lòng đăng nhập lại bằng tài khoản Admin.')
      return
    }

    try {
      setLoadingOrders(true)
      setMessage('')

      const response = await fetch(ORDER_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tải đơn hàng.')
      }

      setOrders(data.orders || [])
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Lỗi khi tải danh sách đơn hàng.',
      )
    } finally {
      setLoadingOrders(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOrders()
    }
  }, [user, loadOrders])

  // Hiển thị tên phương thức thanh toán
  function getPaymentMethodName(method?: PaymentMethod) {
    if (method === 'vietqr') {
      return 'Chuyển khoản VietQR'
    }

    if (method === 'cod') {
      return 'Thanh toán khi nhận hàng'
    }

    return 'Chưa có thông tin'
  }

  // Hiển thị tên trạng thái
  function getStatusName(status: OrderStatus) {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'processing':
        return 'Đang xử lý'
      case 'shipped':
        return 'Đang giao'
      case 'delivered':
        return 'Đã giao'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  // Cập nhật trạng thái đơn hàng
  async function handleUpdateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ) {
    if (!token) {
      setMessage('Vui lòng đăng nhập lại bằng tài khoản Admin.')
      return
    }

    try {
      setUpdatingOrderId(orderId)
      setMessage('')

      const response = await fetch(
        `${ORDER_API_URL}/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật đơn hàng.')
      }

      setMessage('Cập nhật trạng thái đơn hàng thành công!')

      await loadOrders()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Lỗi khi cập nhật trạng thái.',
      )
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Kiểm tra quyền Admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="page-container">
        <h1>Không có quyền truy cập</h1>
        <p>Chỉ tài khoản Admin mới được sử dụng trang này.</p>
      </div>
    )
  }

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <span>BOOKHAVEN MANAGEMENT</span>
        <h1>Quản lý đơn hàng</h1>
        <p>
          Xin chào {user.username}, theo dõi và xử lý đơn hàng của cửa hàng.
        </p>
      </div>

      <section className="admin-panel admin-book-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Danh sách đơn hàng</h2>
            <p>
              Hiện có {orders.length} đơn hàng trong hệ thống.
            </p>
          </div>
          <span className="admin-icon">📦</span>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin" className="admin-cancel">
            Quản lý sách
          </Link>

          <button
            type="button"
            className="admin-submit"
            onClick={loadOrders}
            disabled={loadingOrders}
          >
            {loadingOrders ? 'Đang tải...' : 'Làm mới đơn hàng'}
          </button>
        </div>

        {message && (
          <p className="admin-message" role="status">
            {message}
          </p>
        )}

        {loadingOrders ? (
          <p className="admin-empty">Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">
            Chưa có đơn hàng nào.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table admin-order-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Người nhận</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ giao hàng</th>
                  <th>Ngày đặt</th>
                  <th>Sản phẩm</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td>{order.customerName}</td>

                    <td>
                      {order.phone || 'Chưa có thông tin'}
                    </td>

                    <td className="admin-order-address">
                      {order.address || 'Chưa có thông tin'}
                    </td>

                    <td>
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </td>

                    <td>
                      {order.items.map((item, index) => (
                        <div
                          className="admin-order-product"
                          key={`${item.bookId}-${index}`}
                        >
                          {item.title} × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td>
                      {getPaymentMethodName(order.paymentMethod)}
                    </td>

                    <td>
                      {Number(order.totalAmount).toLocaleString('vi-VN')}đ
                    </td>

                    <td>
                      <select
                        value={order.status}
                        disabled={updatingOrderId === order._id}
                        onChange={(e) =>
                          handleUpdateOrderStatus(
                            order._id,
                            e.target.value as OrderStatus,
                          )
                        }
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>

                      {updatingOrderId === order._id && (
                        <small>Đang cập nhật...</small>
                      )}

                      <small>{getStatusName(order.status)}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminOrders
