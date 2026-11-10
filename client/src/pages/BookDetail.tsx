
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Book } from '../data/books'
import { useCart } from '../context/CartContext'
import './BookDetail.css'

type ApiBook = Omit<Book, 'id'> & {
  _id: string
}

function BookDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [book, setBook] = useState<Book | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)

        const response = await fetch('http://localhost:5000/api/books')

        if (!response.ok) {
          throw new Error('Không thể tải thông tin sách')
        }

        const data = await response.json()

        const foundBook = (data.books as ApiBook[]).find(
          item => item._id === id,
        )

        if (!foundBook) {
          setError('Không tìm thấy cuốn sách này.')
          return
        }

        setBook({
          ...foundBook,
          id: foundBook._id,
        })
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Đã xảy ra lỗi khi tải sách.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  const handleAddToCart = () => {
    if (!book) return

    for (let i = 0; i < quantity; i++) {
      addToCart(book)
    }

    alert(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng!`)
  }

  if (loading) {
    return <div className="detail-message">Đang tải thông tin sách...</div>
  }

  if (error || !book) {
    return (
      <div className="detail-message">
        <h2>{error || 'Không tìm thấy sách'}</h2>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    )
  }

  return (
    <main className="book-detail-page">
      <Link to="/" className="detail-back">
        ← Quay lại cửa hàng
      </Link>

      <div className="book-detail-container">
        <div className="detail-image">
          {book.image ? (
            <img src={book.image} alt={book.title} />
          ) : (
            <div className="book-cover-fallback">
              <span className="fallback-logo">BOOKHAVEN</span>
              <span className="fallback-book-icon">📖</span>
              <strong>{book.title}</strong>
              <small>{book.author}</small>
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="detail-category">
            {book.category}
          </span>

          <h1>{book.title}</h1>

          <p className="detail-author">
            Tác giả: {book.author}
          </p>

          <p className="detail-price">
            {book.price.toLocaleString('vi-VN')}đ
          </p>

          <div className="detail-quantity">
            <span>Số lượng:</span>

            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>

            <strong>{quantity}</strong>

            <button onClick={() => setQuantity(q => q + 1)}>
              +
            </button>
          </div>

          <button
            className="detail-add-cart"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </button>

          <p className="detail-note">
            Cảm ơn bạn đã lựa chọn BookHaven!
          </p>
        </div>
      </div>
    </main>
  )
}

export default BookDetail
