
export type Book = {
  id: string | number
  title: string
  author: string
  price: number
  category: string
  image: string
  label?: string
}

export const books: Book[] = [
  {
    id: 1,
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    price: 79000,
    category: 'van-hoc',
    image: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    label: 'Bán chạy',
  },
  {
    id: 2,
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    price: 85000,
    category: 'ky-nang',
    image: 'https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg',
    label: 'Phổ biến',
  },
  {
    id: 3,
    title: 'Doraemon',
    author: 'Fujiko F. Fujio',
    price: 25000,
    category: 'truyen-tranh',
    image: 'https://covers.openlibrary.org/b/isbn/9784088518316-L.jpg',
  },
  {
    id: 4,
    title: 'Tuổi Thơ Dữ Dội',
    author: 'Phùng Quán',
    price: 110000,
    category: 'thieu-nhi',
    image: 'https://covers.openlibrary.org/b/isbn/9786042247405-L.jpg',
  },
  {
    id: 5,
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    price: 135000,
    category: 'khoa-hoc',
    image: 'https://covers.openlibrary.org/b/isbn/9780553802023-L.jpg',
  },
  {
    id: 6,
    title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
    author: 'Nguyễn Nhật Ánh',
    price: 95000,
    category: 'van-hoc',
    image: 'https://covers.openlibrary.org/b/isbn/9786041116313-L.jpg',
  },
]

export const categories = [
  { id: 'all', name: 'Tất cả sách' },
  { id: 'van-hoc', name: 'Văn học' },
  { id: 'truyen-tranh', name: 'Truyện tranh' },
  { id: 'thieu-nhi', name: 'Thiếu nhi' },
  { id: 'khoa-hoc', name: 'Khoa học' },
  { id: 'ky-nang', name: 'Kỹ năng' },
]
