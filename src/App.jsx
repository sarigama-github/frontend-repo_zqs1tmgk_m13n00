import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const url = new URL(`${API_BASE}/api/spare-parts`)
        if (search) url.searchParams.set('q', search)
        if (brand) url.searchParams.set('brand', brand)
        if (category) url.searchParams.set('category', category)
        const res = await fetch(url)
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [search, brand, category])

  useEffect(() => {
    setFiltered(items)
  }, [items])

  const brands = useMemo(() => Array.from(new Set(items.map(i => i.brand))).filter(Boolean), [items])
  const categories = useMemo(() => Array.from(new Set(items.map(i => i.category))).filter(Boolean), [items])

  const onAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.sku === product.sku)
      if (existing) {
        return prev.map(p => p.sku === product.sku ? { ...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const onCheckout = async () => {
    try {
      const payload = {
        customer_name: 'Guest',
        email: 'guest@example.com',
        phone: 'N/A',
        address: 'N/A',
        items: cart.map(c => ({ product_id: c._id || '', name: c.name, price: c.price, quantity: c.quantity })),
        subtotal: cart.reduce((s, c) => s + c.price * c.quantity, 0),
        delivery_fee: 0,
        total: cart.reduce((s, c) => s + c.price * c.quantity, 0)
      }
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Checkout failed')
      setCart([])
      alert('Order placed!')
      setCartOpen(false)
    } catch (e) {
      alert('Checkout failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header cartCount={cart.reduce((s,c)=>s+c.quantity,0)} onCartClick={() => setCartOpen(true)} />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Find Car Spare Parts</h1>
          <div className="flex gap-2 flex-1 sm:flex-none">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:w-64 px-3 py-2 rounded-lg border"
              placeholder="Search by name, SKU, brand..."
            />
            <select value={brand} onChange={e=>setBrand(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={category} onChange={e=>setCategory(e.target.value)} className="px-3 py-2 rounded-lg border">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_,i) => (
              <div key={i} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <ProductCard key={item.sku} product={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </section>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onCheckout={onCheckout} />
    </div>
  )
}

export default App
