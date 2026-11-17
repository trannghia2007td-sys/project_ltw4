
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

type PaymentMethod = 'cod' | 'vietqr'

function CartPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    cartItems,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const [loading, setLoading] = useState(false)

  // Thông tin giao hàng
  const [customerName, setCustomerName] = useState(user?.username || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cod')

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + 'đ'

  // Xử lý đặt hàng
  const handleCheckout = async () => {
    // Kiểm tra đăng nhập
    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng!')
      navigate('/login')
      return
    }

    // Chỉ khách hàng mới được đặt hàng
    if (user.role !== 'customer') {
      alert('Tài khoản quản trị không thể đặt hàng!')
      return
    }

    // Kiểm tra giỏ hàng
    if (cartItems.length === 0) {
      alert('Giỏ hàng đang trống!')
      return
    }

    // Kiểm tra thông tin giao hàng
    if (!customerName.trim()) {
      alert('Vui lòng nhập tên người nhận!')
      return
    }

    const cleanPhone = phone.replace(/[\s.-]/g, '')

    if (!/^(0|\+84)\d{9,10}$/.test(cleanPhone)) {
      alert('Số điện thoại không hợp lệ!')
      return
    }

    if (!address.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng!')
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem('bookhaven-token')

      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
        navigate('/login')
        return
      }

      const orderItems = cartItems.map((item) => ({
        bookId: String(item.book.id),
        quantity: item.quantity,
      }))

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          customerName: customerName.trim(),
          phone: cleanPhone,
          address: address.trim(),
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại!')
      }

      // Đặt hàng thành công thì xóa giỏ hàng
      clearCart()

      if (paymentMethod === 'vietqr') {
        alert(
          'Đặt hàng thành công! Vui lòng theo dõi thông tin thanh toán QR trong chi tiết đơn hàng.',
        )
      } else {
        alert(
          'Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng. Cảm ơn bạn đã mua sắm tại BookHaven.',
        )
      }

      navigate('/orders')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đặt hàng!'

      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1>Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <>
          <p>Giỏ hàng đang trống!</p>
          <Link to="/">Tiếp tục mua sắm</Link>
        </>
      ) : (
        <>
          {/* Danh sách sản phẩm */}
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.book.id}>
                <img src={item.book.image} alt={item.book.title} />

                <div className="cart-item-info">
                  <h3>{item.book.title}</h3>
                  <p>{formatPrice(item.book.price)}</p>

                  <div className="cart-quantity">
                    <button
                      onClick={() => decreaseQuantity(item.book.id)}
                      disabled={loading}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.book.id)}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="cart-remove"
                  onClick={() => removeFromCart(item.book.id)}
                  disabled={loading}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="cart-total">
            <span>Tổng tiền:</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          {/* Thông tin giao hàng */}
          <div className="checkout-section">
            <h2>Thông tin nhận hàng</h2>

            <div className="checkout-form">
              <div className="checkout-form-group">
                <label htmlFor="customerName">Tên người nhận</label>
                <input
                  id="customerName"
                  type="text"
                  placeholder="Nhập tên người nhận"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="checkout-form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="checkout-form-group">
                <label htmlFor="address">Địa chỉ giao hàng</label>
                <textarea
                  id="address"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="checkout-section">
            <h2>Phương thức thanh toán</h2>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  disabled={loading}
                />

                <span>
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <small>
                    Thanh toán trực tiếp khi nhân viên giao hàng.
                  </small>
                </span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vietqr"
                  checked={paymentMethod === 'vietqr'}
                  onChange={() => setPaymentMethod('vietqr')}
                  disabled={loading}
                />

                <span>
                  <strong>Chuyển khoản bằng QR VietQR</strong>
                  <small>
                    Thanh toán bằng cách quét mã QR ngân hàng.
                  </small>
                </span>
              </label>
            </div>

            {paymentMethod === 'vietqr' && (
              <div className="payment-note">
                <p>
                  Sau khi đặt hàng, thông tin thanh toán và mã QR
                  sẽ được hiển thị khi BookHaven cấu hình tài khoản
                  ngân hàng.
                </p>
              </div>
            )}
          </div>

          {/* Nút đặt hàng */}
          <button
            className="cart-checkout"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
        </>
      )}
    </div>
  )
}

export default CartPage
