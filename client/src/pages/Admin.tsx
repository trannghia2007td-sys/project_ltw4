import { useCallback, useEffect, useState, type FormEvent, type ChangeEvent } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:5000/api/books'

const initialForm = {
  title: '',
  author: '',
  price: '',
  category: 'van-hoc',
  image: '',
  label: '',
}

type AdminBook = {
  _id: string
  title: string
  author: string
  price: number
  category: string
  image: string
  label: string
}

function Admin() {
  const { user } = useAuth()

  const [form, setForm] = useState(initialForm)
  const [books, setBooks] = useState<AdminBook[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const token = localStorage.getItem('bookhaven-token')

  // Tải danh sách sách
  const loadBooks = useCallback(async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tải danh sách sách.')
      }

      setBooks(data.books || [])
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Lỗi khi tải danh sách sách.',
      )
    }
  }, [])

  useEffect(() => {
    loadBooks()
  }, [loadBooks])

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // Thêm hoặc cập nhật sách
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')

    if (!form.title.trim() || !form.author.trim() || !form.price) {
      setMessage('Vui lòng nhập đầy đủ thông tin sách.')
      return
    }

    const price = Number(form.price)

    // Kiểm tra giá sách
    console.log('Giá nhập:', form.price)
    console.log('Giá sau Number:', price)

    if (!Number.isFinite(price) || price <= 0) {
      setMessage('Giá sách phải là số lớn hơn 0.')
      return
    }

    if (!token) {
      setMessage('Vui lòng đăng nhập lại bằng tài khoản Admin.')
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            price,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lưu sách.')
      }

      setMessage(
        editingId
          ? 'Cập nhật sách thành công!'
          : 'Thêm sách thành công!',
      )

      setForm(initialForm)
      setEditingId(null)

      await loadBooks()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi lưu sách.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Đưa thông tin sách lên form để sửa
  function handleEdit(book: AdminBook) {
    setEditingId(book._id)

    setForm({
      title: book.title,
      author: book.author,
      price: String(book.price),
      category: book.category,
      image: book.image || '',
      label: book.label || '',
    })

    setMessage('Đang chỉnh sửa sách: ' + book.title)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Hủy chỉnh sửa
  function handleCancelEdit() {
    setEditingId(null)
    setForm(initialForm)
    setMessage('')
  }

  // Xóa sách
  async function handleDelete(book: AdminBook) {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa sách "${book.title}" không?`,
    )

    if (!confirmed) return

    if (!token) {
      setMessage('Vui lòng đăng nhập lại bằng tài khoản Admin.')
      return
    }

    try {
      setMessage('')

      const response = await fetch(`${API_URL}/${book._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa sách.')
      }

      // Nếu đang sửa cuốn sách vừa bị xóa thì đặt lại form
      if (editingId === book._id) {
        setEditingId(null)
        setForm(initialForm)
      }

      setMessage('Đã xóa sách thành công!')
      await loadBooks()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi xóa sách.',
      )
    }
  }

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
        <h1>Trang quản trị</h1>
        <p>Xin chào {user.username}, hãy quản lý kho sách của cửa hàng.</p>
      </div>

      {/* FORM THÊM VÀ SỬA SÁCH */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{editingId ? 'Chỉnh sửa sách' : 'Thêm sách mới'}</h2>
            <p>
              {editingId
                ? 'Cập nhật thông tin sách trong cửa hàng.'
                : 'Điền thông tin để đưa sách lên cửa hàng.'}
            </p>
          </div>
          <span className="admin-icon">📚</span>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="title">Tên sách *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nhập tên sách"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="author">Tác giả *</label>
            <input
              id="author"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Nhập tên tác giả"
              required
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="price">Giá bán (VNĐ) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                placeholder="Ví dụ: 85000"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="category">Thể loại *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="van-hoc">Văn học</option>
                <option value="truyen-tranh">Truyện tranh</option>
                <option value="thieu-nhi">Thiếu nhi</option>
                <option value="khoa-hoc">Khoa học</option>
                <option value="ky-nang">Kỹ năng</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="image">Đường dẫn ảnh bìa</label>
            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
            <small>
              Có thể để trống, hệ thống sẽ hiển thị bìa dự phòng.
            </small>
          </div>

          <div className="admin-form-group">
            <label htmlFor="label">Nhãn sách</label>
            <input
              id="label"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Ví dụ: Bán chạy, Sách mới..."
            />
          </div>

          {message && (
            <p className="admin-message" role="status">
              {message}
            </p>
          )}

          <div className="admin-form-actions">
            <button
              className="admin-submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Đang lưu sách...'
                : editingId
                  ? 'Lưu thay đổi'
                  : '+ Thêm sách vào cửa hàng'}
            </button>

            {editingId && (
              <button
                className="admin-cancel"
                type="button"
                onClick={handleCancelEdit}
              >
                Hủy chỉnh sửa
              </button>
            )}
          </div>
        </form>
      </section>

      {/* DANH SÁCH SÁCH */}
      <section className="admin-panel admin-book-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Danh sách sách</h2>
            <p>Hiện có {books.length} cuốn sách trong cửa hàng.</p>
          </div>
          <span className="admin-icon">📖</span>
        </div>

        {books.length === 0 ? (
          <p className="admin-empty">Chưa có sách trong cửa hàng.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Giá bán</th>
                  <th>Thể loại</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book, index) => (
                  <tr key={book._id}>
                    <td>{index + 1}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.price.toLocaleString('vi-VN')}đ</td>
                    <td>{book.category}</td>
                    <td>
                      <div className="admin-book-actions">
                        <button
                          type="button"
                          className="admin-edit"
                          onClick={() => handleEdit(book)}
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="admin-delete"
                          onClick={() => handleDelete(book)}
                        >
                          Xóa
                        </button>
                      </div>
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

export default Admin