
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

type HeaderProps = {
  keyword: string
  onSearch: (value: string) => void
  cartCount: number
}

function Header({
  keyword,
  onSearch,
  cartCount,
}: HeaderProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📖</span>
          <span>
            Book<span>Haven</span>
          </span>
        </Link>

        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả..."
            value={keyword}
            onChange={(e) => onSearch(e.target.value)}
          />

          <button type="button" aria-label="Tìm kiếm">
            ⌕
          </button>
        </div>

        <div className="header-actions">
          {/* Chuyển đổi giao diện sáng và tối */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === 'light'
                ? 'Chuyển sang giao diện tối'
                : 'Chuyển sang giao diện sáng'
            }
            title={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="user-actions">
              <span className="user-welcome">
                👋 Xin chào, <strong>{user.username}</strong>
              </span>

              {/* Chức năng dành cho khách hàng */}
              {user.role === 'customer' && (
                <Link to="/orders" className="login-button">
                  Đơn hàng
                </Link>
              )}

              {/* Chức năng dành riêng cho Admin */}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="login-button">
                    Quản lý sách
                  </Link>

                  <Link to="/admin/categories" className="login-button">
                    Danh mục
                  </Link>

                  <Link to="/admin/orders" className="login-button">
                    Quản lý đơn hàng
                  </Link>
                  <Link to ="/admin/users" className="login-button">
                    Quản lý người dùng
                  </Link>
                </>
              )}

              <button
                type="button"
                className="login-button"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Đăng nhập
            </Link>
          )}

          <Link to="/cart" className="cart-button">
            🛒 Giỏ hàng
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
