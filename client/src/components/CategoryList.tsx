
import { categories } from '../data/books'

type CategoryListProps = {
  selected: string
  onSelect: (category: string) => void
}

function CategoryList({ selected, onSelect }: CategoryListProps) {
  return (
    <section className="category-section">
      <div className="section-heading">
        <div>
          <span className="section-subtitle">KHÁM PHÁ</span>
          <h2>Danh mục sách</h2>
        </div>
      </div>

      <div className="category-list">
        {categories.map((item) => (
          <button
            key={item.id}
            className={`category-button ${
              selected === item.id ? 'active' : ''
            }`}
            onClick={() => onSelect(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  )
}

export default CategoryList
