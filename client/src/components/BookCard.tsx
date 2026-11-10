
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Book } from '../data/books'

type BookCardProps = {
  book: Book
  onAddToCart: () => void
}

function BookCard({ book, onAddToCart }: BookCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [book.image])

  return (
    <article className="book-card">
      <div className="book-image">
        {book.label && (
          <span className="book-label">{book.label}</span>
        )}

        <Link to={`/books/${book.id}`} className="book-detail-link">
          {book.image && !imageFailed ? (
            <img
              src={book.image}
              alt={book.title}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="book-cover-fallback">
              <span className="fallback-logo">BOOKHAVEN</span>
              <span className="fallback-book-icon">📖</span>
              <strong>{book.title}</strong>
              <small>{book.author}</small>
            </div>
          )}
        </Link>
      </div>

      <div className="book-info">
        <h3>
          <Link to={`/books/${book.id}`} className="book-detail-link">
            {book.title}
          </Link>
        </h3>

        <p className="book-author">{book.author}</p>

        <div className="book-bottom">
          <strong>{book.price.toLocaleString('vi-VN')}đ</strong>

          <button
            className="add-cart"
            onClick={onAddToCart}
            aria-label={`Thêm ${book.title} vào giỏ`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}

export default BookCard
