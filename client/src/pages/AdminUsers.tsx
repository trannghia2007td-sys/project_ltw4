
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:5000/api/users'

type AdminUser = {
  _id: string
  username: string
  role: 'customer' | 'admin'
  createdAt: string
}

function AdminUsers() {
  const { user } = useAuth()

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const token = localStorage.getItem('bookhaven-token')

  // Tải danh sách người dùng
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      if (!token) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tải danh sách người dùng.')
      }

      setUsers(data.users || [])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Đã xảy ra lỗi khi tải người dùng.',
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Thay đổi quyền tài khoản
  async function handleChangeRole(targetUser: AdminUser) {
    const newRole =
      targetUser.role === 'customer' ? 'admin' : 'customer'

    const roleName = newRole === 'admin' ? 'Admin' : 'Khách hàng'

    const confirmed = window.confirm(
      `Bạn có chắc muốn đổi quyền của "${targetUser.username}" thành ${roleName}?`,
    )

    if (!confirmed) return

    if (!token) {
      setError('Vui lòng đăng nhập lại.')
      return
    }

    try {
      setProcessingId(targetUser._id)
      setMessage('')
      setError('')

      const response = await fetch(
        `${API_URL}/${targetUser._id}/role`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể thay đổi quyền.')
      }

      setMessage(data.message || 'Cập nhật quyền thành công.')
      await loadUsers()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Đã xảy ra lỗi khi thay đổi quyền.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  // Xóa tài khoản
  async function handleDelete(targetUser: AdminUser) {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${targetUser.username}" không?`,
    )

    if (!confirmed) return

    if (!token) {
      setError('Vui lòng đăng nhập lại.')
      return
    }

    try {
      setProcessingId(targetUser._id)
      setMessage('')
      setError('')

      const response = await fetch(
        `${API_URL}/${targetUser._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Không thể xóa tài khoản.')
      }

      setMessage(data.message || 'Xóa tài khoản thành công.')
      await loadUsers()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Đã xảy ra lỗi khi xóa tài khoản.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  // Kiểm tra quyền truy cập
  if (!user || user.role !== 'admin') {
    return (
      <div className="page-container">
        <h1>Không có quyền truy cập</h1>
        <p>Chỉ tài khoản Admin mới được sử dụng trang này.</p>
      </div>
    )
  }

  const adminCount = users.filter(
    (item) => item.role === 'admin',
  ).length

  const customerCount = users.filter(
    (item) => item.role === 'customer',
  ).length

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <span>BOOKHAVEN MANAGEMENT</span>
        <h1>Quản lý người dùng</h1>
        <p>
          Xin chào {user.username}, quản lý tài khoản và quyền truy cập
          của người dùng.
        </p>
      </div>

      {/* Thống kê người dùng */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Tổng quan tài khoản</h2>
            <p>Thống kê người dùng trong hệ thống.</p>
          </div>
          <span className="admin-icon">👥</span>
        </div>

        <div className="user-statistics">
          <div className="user-stat-item">
            <span>Tổng tài khoản</span>
            <strong>{users.length}</strong>
          </div>

          <div className="user-stat-item">
            <span>Quản trị viên</span>
            <strong>{adminCount}</strong>
          </div>

          <div className="user-stat-item">
            <span>Khách hàng</span>
            <strong>{customerCount}</strong>
          </div>
        </div>
      </section>

      {/* Danh sách tài khoản */}
      <section className="admin-panel admin-book-list">
        <div className="admin-panel-heading">
          <div>
            <h2>Danh sách người dùng</h2>
            <p>
              Có {users.length} tài khoản trong hệ thống.
            </p>
          </div>

          <button
            type="button"
            className="admin-submit"
            onClick={loadUsers}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : '↻ Làm mới'}
          </button>
        </div>

        {message && (
          <p className="admin-message" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="admin-message" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="admin-empty">Đang tải danh sách người dùng...</p>
        ) : users.length === 0 ? (
          <p className="admin-empty">
            Chưa có tài khoản nào trong hệ thống.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên đăng nhập</th>
                  <th>Vai trò</th>
                  <th>Ngày đăng ký</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item, index) => {
                  const isCurrentUser = item._id === user.id
                  const isProcessing = processingId === item._id

                  return (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{item.username}</strong>
                        {isCurrentUser && (
                          <small> (Bạn)</small>
                        )}
                      </td>

                      <td>
                        <span
                          className={`user-role ${
                            item.role === 'admin'
                              ? 'user-role-admin'
                              : 'user-role-customer'
                          }`}
                        >
                          {item.role === 'admin'
                            ? 'Quản trị viên'
                            : 'Khách hàng'}
                        </span>
                      </td>

                      <td>
                        {new Date(item.createdAt).toLocaleDateString(
                          'vi-VN',
                        )}
                      </td>

                      <td>
                        <div className="admin-book-actions">
                          <button
                            type="button"
                            className="admin-edit"
                            disabled={isCurrentUser || isProcessing}
                            onClick={() => handleChangeRole(item)}
                          >
                            {isProcessing
                              ? 'Đang xử lý...'
                              : item.role === 'admin'
                                ? 'Hạ quyền'
                                : 'Nâng quyền'}
                          </button>

                          <button
                            type="button"
                            className="admin-delete"
                            disabled={isCurrentUser || isProcessing}
                            onClick={() => handleDelete(item)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminUsers
