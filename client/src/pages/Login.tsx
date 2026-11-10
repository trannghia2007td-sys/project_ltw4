
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type AuthTab = 'login' | 'register'

function Login() {
  const navigate = useNavigate()
  const { loginSuccess } = useAuth()

  const [activeTab, setActiveTab] = useState<AuthTab>('login')

  // Dữ liệu đăng nhập
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Dữ liệu đăng ký
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Ẩn / hiện mật khẩu
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Kiểm tra độ mạnh mật khẩu
  const passwordStrength =
    newPassword.length >= 10
      ? 'Mạnh'
      : newPassword.length >= 6
        ? 'Trung bình'
        : newPassword.length > 0
          ? 'Yếu'
          : ''

  // ĐĂNG NHẬP
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedUsername = username.trim()

    if (!trimmedUsername || !password.trim()) {
      setMessage('Vui lòng nhập đầy đủ tài khoản và mật khẩu.')
      return
    }

    try {
      setIsLoading(true)
      setMessage('')

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Đăng nhập thất bại.')
        return
      }

      // Cập nhật trạng thái đăng nhập toàn hệ thống
      loginSuccess(data.user, data.token)

      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  // ĐĂNG KÝ
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmedUsername = newUsername.trim()

    if (!trimmedUsername || !newPassword || !confirmPassword) {
      setMessage('Vui lòng điền đầy đủ thông tin.')
      return
    }

    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      setMessage('Tên đăng nhập phải từ 3 đến 30 ký tự.')
      return
    }

    if (newPassword.length < 6) {
      setMessage('Mật khẩu cần có ít nhất 6 ký tự.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu nhập lại không khớp.')
      return
    }

    try {
      setIsLoading(true)
      setMessage('')

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Đăng ký thất bại.')
        return
      }

      setMessage('Đăng ký thành công! Em có thể đăng nhập ngay.')

      setUsername(trimmedUsername)
      setPassword('')
      setNewUsername('')
      setNewPassword('')
      setConfirmPassword('')

      setShowRegisterPassword(false)
      setShowConfirmPassword(false)

      setActiveTab('login')
    } catch (error) {
      console.error('Register error:', error)
      setMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  // Chuyển đổi tab
  function changeTab(tab: AuthTab) {
    setActiveTab(tab)
    setMessage('')
  }

  return (
    <main className="auth-page">

      {/* Các biểu tượng trang trí */}
      <div className="auth-decoration" aria-hidden="true">
        <span className="deco-book deco-1">📖</span>
        <span className="deco-book deco-2">📚</span>
        <span className="deco-book deco-3">⭐</span>
        <span className="deco-book deco-4">📕</span>
        <span className="deco-book deco-5">✒️</span>
        <span className="deco-book deco-6">📖</span>
        <span className="deco-book deco-7">✨</span>
      </div>

      {/* Thẻ đăng nhập / đăng ký */}
      <section className="auth-card">

        <Link to="/" className="auth-back">
          ← Quay lại cửa hàng
        </Link>

        <div className="auth-heading">
          <div className="auth-logo">📖</div>

          <h1>BookHaven</h1>

          <p>
            {activeTab === 'login'
              ? 'Đăng nhập để mua sách và quản lý giỏ hàng'
              : 'Tạo tài khoản để bắt đầu hành trình đọc sách'}
          </p>
        </div>

        {/* Hai tab */}
        <div className="auth-tabs">
          <button
            type="button"
            className={activeTab === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => changeTab('login')}
            disabled={isLoading}
          >
            Đăng nhập
          </button>

          <button
            type="button"
            className={activeTab === 'register' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => changeTab('register')}
            disabled={isLoading}
          >
            Đăng ký
          </button>
        </div>

        {/* FORM ĐĂNG NHẬP */}
        {activeTab === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>

            <label>Tên đăng nhập</label>

            <div className="auth-input-wrap">
              <span>👤</span>

              <input
                type="text"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <label>Mật khẩu</label>

            <div className="auth-input-wrap">
              <span>🔒</span>

              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              <span>→</span>
            </button>

            <p className="auth-switch">
              Chưa có tài khoản?

              <button
                type="button"
                onClick={() => changeTab('register')}
              >
                Đăng ký ngay
              </button>
            </p>

          </form>
        )}

        {/* FORM ĐĂNG KÝ */}
        {activeTab === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>

            <label>Tên đăng nhập</label>

            <div className="auth-input-wrap">
              <span>👤</span>

              <input
                type="text"
                placeholder="Nhập tên đăng nhập..."
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            <label>Mật khẩu</label>

            <div className="auth-input-wrap">
              <span>🔒</span>

              <input
                type={showRegisterPassword ? 'text' : 'password'}
                placeholder="Tạo mật khẩu..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              >
                {showRegisterPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            {/* Độ mạnh mật khẩu */}
            {passwordStrength && (
              <p className="password-strength">
                Độ mạnh mật khẩu:

                <strong
                  className={
                    passwordStrength === 'Mạnh'
                      ? 'strength-strong'
                      : passwordStrength === 'Trung bình'
                        ? 'strength-medium'
                        : 'strength-weak'
                  }
                >
                  {passwordStrength}
                </strong>
              </p>
            )}

            <label>Nhập lại mật khẩu</label>

            <div className="auth-input-wrap">
              <span>🔐</span>

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              <span>→</span>
            </button>

            <p className="auth-switch">
              Đã có tài khoản?

              <button
                type="button"
                onClick={() => changeTab('login')}
              >
                Đăng nhập
              </button>
            </p>

          </form>
        )}

        {/* Thông báo */}
        {message && (
          <div className="auth-message" role="status">
            {message}
          </div>
        )}

        {/* Footer tự động cập nhật ngày */}
        <div className="auth-footer">
          © {new Date().toLocaleDateString('vi-VN')} BookHaven - Con đường đi đến thành công
        </div>

      </section>
    </main>
  )
}

export default Login
