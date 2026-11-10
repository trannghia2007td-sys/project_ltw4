import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartPage() {
  const {
    cartItems,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + 'đ'

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
          {cartItems.map((item) => (
            <div className="cart-item" key={item.book.id}>
              <img src={item.book.image} alt={item.book.title} />

              <div className="cart-item-info">
                <h3>{item.book.title}</h3>
                <p>{formatPrice(item.book.price)}</p>

                <div className="cart-quantity">
                  <button onClick={() => decreaseQuantity(item.book.id)}>
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQuantity(item.book.id)}>
                    +
                  </button>
                </div>
              </div>

              <button
                className="cart-remove"
                onClick={() => removeFromCart(item.book.id)}
              >
                Xóa
              </button>
            </div>
          ))}

          <div className="cart-total">
            <span>Tổng tiền:</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <Link to="/login" className="cart-checkout">
            Tiến hành đặt hàng
          </Link>
        </>
      )}
    </div>
  )
}

export default CartPage