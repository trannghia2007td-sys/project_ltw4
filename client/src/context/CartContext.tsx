import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { Book } from '../data/books'

export type CartItem = {
  book: Book
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  cartCount: number
  total: number
  addToCart: (book: Book) => void
  increaseQuantity: (id: string | number) => void
  decreaseQuantity: (id: string | number) => void
  removeFromCart: (id: string | number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

function getSavedCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem('bookhaven-cart')
    return savedCart ? JSON.parse(savedCart) as CartItem[] : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(getSavedCart)

  useEffect(() => {
    localStorage.setItem('bookhaven-cart', JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(book: Book) {
    setCartItems((current) => {
      const existing = current.find(
        (item) => String(item.book.id) === String(book.id),
      )

      if (existing) {
        return current.map((item) =>
          String(item.book.id) === String(book.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { book, quantity: 1 }]
    })
  }

  function increaseQuantity(id: string | number) {
    setCartItems((current) =>
      current.map((item) =>
        String(item.book.id) === String(id)
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    )
  }

  function decreaseQuantity(id: string | number) {
    setCartItems((current) =>
      current
        .map((item) =>
          String(item.book.id) === String(id)
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(id: string | number) {
    setCartItems((current) =>
      current.filter(
        (item) => String(item.book.id) !== String(id),
      ),
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  const total = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        total,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart phải được sử dụng bên trong CartProvider')
  }

  return context
}