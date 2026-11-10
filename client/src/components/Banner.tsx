
function Banner() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-tag">BOOKHAVEN - THẾ GIỚI SÁCH</span>

        <h1>
          Khám phá thế giới
          <br />
          qua từng trang sách
        </h1>

        <p>
          Mỗi cuốn sách là một hành trình mới.
          Hãy tìm cho mình những cuốn sách yêu thích nhé!
        </p>

        <a href="#books" className="hero-button">
          Khám phá ngay <span>→</span>
        </a>
      </div>

      <div className="hero-decoration">
        <div className="hero-book">📚</div>
        <span className="decoration-star star-one">✦</span>
        <span className="decoration-star star-two">✧</span>
      </div>
    </section>
  )
}

export default Banner
