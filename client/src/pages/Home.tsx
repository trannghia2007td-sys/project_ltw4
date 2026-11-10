import { useEffect, useMemo, useState } from 'react'

import Header from '../components/Header'
import Banner from '../components/Banner'
import CategoryList from '../components/CategoryList'
import BookCard from '../components/BookCard'
import Footer from '../components/Footer'

import type { Book } from '../data/books'
import { useCart } from '../context/CartContext'

type ApiBook = Omit<Book, 'id'> & {
  _id: string
}

function Home() {
  const { cartCount, addToCart } = useCart()

  const [books, setBooks] = useState<Book[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:5000/api/books')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Không thể tải sách')
        }

        const formattedBooks: Book[] = (data.books as ApiBook[]).map(
          (book) => ({
            ...book,
            id: book._id,
          }),
        )

        setBooks(formattedBooks)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể kết nối đến máy chủ',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return books.filter((book) => {
      const matchCategory =
        selectedCategory === 'all' ||
        book.category === selectedCategory

      const matchKeyword =
        book.title.toLowerCase().includes(normalizedKeyword) ||
        book.author.toLowerCase().includes(normalizedKeyword)

      return matchCategory && matchKeyword
    })
  }, [books, selectedCategory, keyword])

  return (
    <>
      <Header
        keyword={keyword}
        onSearch={setKeyword}
        cartCount={cartCount}
      />

      <Banner />

      <main className="main-content">
        <CategoryList
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <section className="book-section">
          <div className="section-heading">
            <div>
              <span className="section-subtitle">KHÁM PHÁ TRI THỨC</span>
              <h2>Sách nổi bật</h2>
            </div>

            <span className="book-count">
              {books.length} cuốn sách
            </span>
          </div>

          {loading ? (
            <p className="empty-result">Đang tải danh sách sách...</p>
          ) : error ? (
            <p className="empty-result">{error}</p>
          ) : (
            <div className="book-grid">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onAddToCart={() => addToCart(book)}
                  />
                ))
              ) : (
                <p className="empty-result">
                  Không tìm thấy sách phù hợp.
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Home