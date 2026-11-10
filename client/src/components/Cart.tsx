
import type { Book } from '../data/books'

type CartItem = {
  book: Book
  quantity: number
}

type CartProps = {
  items: CartItem[]
  onIncrease: (id: string | number ) => void
  onDecrease: (id: string | number ) => void
  onRemove: (id: string | number) => void
  onClose: () => void
}

function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onClose,
}: CartProps) {
  const total = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0,
  )

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + 'đ'

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Giỏ hàng của bạn</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Giỏ hàng đang trống!</p>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <div className="cart-item" key={item.book.id}>
                  <img src={item.book.image} alt={item.book.title} />

                  <div className="cart-item-info">
                    <h3>{item.book.title}</h3>
                    <p>{formatPrice(item.book.price)}</p>

                    <div className="cart-quantity">
                      <button onClick={() => onDecrease(item.book.id)}>
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => onIncrease(item.book.id)}>
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="cart-remove"
                    onClick={() => onRemove(item.book.id)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <span>Tổng tiền:</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <button className="cart-checkout">
              Tiến hành đặt hàng
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
