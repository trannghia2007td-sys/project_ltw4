
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:5000/api/categories'

type Category = {
  _id: string
  name: string
  slug: string
}

const initialForm = {
  name: '',
  slug: '',
}

function AdminCategories() {
  const { user } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const token = localStorage.getItem('bookhaven-token')

  // Tải danh sách danh mục
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tải danh mục.')
      }

      setCategories(data.categories || [])
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Lỗi khi tải danh mục.',
      )
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // Nhập thông tin danh mục
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // Thêm hoặc cập nhật danh mục
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')

    if (!form.name.trim() || !form.slug.trim()) {
      setMessage('Vui lòng nhập đầy đủ tên và mã danh mục.')
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
            name: form.name.trim(),
            slug: form.slug.trim().toLowerCase(),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể lưu danh mục.')
      }

      setMessage(
        editingId
          ? 'Cập nhật danh mục thành công!'
          : 'Thêm danh mục thành công!',
      )

      setForm(initialForm)
      setEditingId(null)

      await loadCategories()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi lưu danh mục.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Đưa danh mục lên form
  function handleEdit(category: Category) {
    setEditingId(category._id)

    setForm({
      name: category.name,
      slug: category.slug,
    })

    setMessage('Đang chỉnh sửa danh mục: ' + category.name)

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

  // Xóa danh mục
  async function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`,
    )

    if (!confirmed) return

    if (!token) {
      setMessage('Vui lòng đăng nhập lại bằng tài khoản Admin.')
      return
    }

    try {
      setMessage('')

      const response = await fetch(`${API_URL}/${category._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa danh mục.')
      }

      if (editingId === category._id) {
        setEditingId(null)
        setForm(initialForm)
      }

      setMessage('Xóa danh mục thành công!')
      await loadCategories()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi xóa danh mục.',
      )
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
        <h1>Quản lý danh mục</h1>
        <p>
          Xin chào {user.username}, hãy quản lý danh mục sách của cửa hàng.
        </p>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <p>
              {editingId
                ? 'Cập nhật tên hoặc mã danh mục.'
                : 'Nhập tên và mã để tạo danh mục mới.'}
            </p>
          </div>

          <span className="admin-icon">📚</span>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="category-name">Tên danh mục *</label>
            <input
              id="category-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ví dụ: Văn học"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="category-slug">Mã danh mục *</label>
            <input
              id="category-slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Ví dụ: van-hoc"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Chỉ sử dụng chữ thường không dấu, số và dấu gạch ngang."
              required
            />
            <small>
              Viết thường, không dấu, các từ cách nhau bằng dấu gạch ngang.
            </small>
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
                ? 'Đang lưu...'
                : editingId
                  ? 'Lưu thay đổi'
                  : '+ Thêm danh mục'}
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

      <section className="admin-panel admin-book-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Danh sách danh mục</h2>
            <p>Hiện có {categories.length} danh mục.</p>
          </div>

          <span className="admin-icon">📖</span>
        </div>

        {categories.length === 0 ? (
          <p className="admin-empty">Chưa có danh mục nào.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên danh mục</th>
                  <th>Mã danh mục</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>
                      <div className="admin-book-actions">
                        <button
                          type="button"
                          className="admin-edit"
                          onClick={() => handleEdit(category)}
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="admin-delete"
                          onClick={() => handleDelete(category)}
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

export default AdminCategories
