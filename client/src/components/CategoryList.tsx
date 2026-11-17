
type Category = {
  _id: string
  name: string
  slug: string
}

type CategoryListProps = {
  categories: Category[]
  selected: string
  onSelect: (category: string) => void
}

function CategoryList({
  categories,
  selected,
  onSelect,
}: CategoryListProps) {
  return (
    <section className="category-section">
      <div className="section-heading">
        <div>
          <span className="section-subtitle">KHÁM PHÁ</span>
          <h2>Danh mục sách</h2>
        </div>
      </div>

      <div className="category-list">
        <button
          className={`category-button ${
            selected === 'all' ? 'active' : ''
          }`}
          onClick={() => onSelect('all')}
        >
          Tất cả sách
        </button>

        {categories.map((item) => (
          <button
            key={item._id}
            className={`category-button ${
              selected === item.slug ? 'active' : ''
            }`}
            onClick={() => onSelect(item.slug)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  )
}

export default CategoryList
