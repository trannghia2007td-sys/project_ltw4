
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          📖 Book<span>Haven</span>
        </div>

        <p>Con đường đi đến thành công bắt đầu từ tri thức.</p>

        <p className="copyright">
  © {new Date().getFullYear()} BookHaven. All rights reserved.
</p>
      </div>
    </footer>
  )
}

export default Footer
