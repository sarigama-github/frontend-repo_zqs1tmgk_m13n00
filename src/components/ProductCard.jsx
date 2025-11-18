function ProductCard({ product, onAddToCart }) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1635321544164-c0c4e3bcd44e?q=80&w=1200&auto=format&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="p-4">
        <div className="text-xs text-slate-500 mb-1">{product.brand} • {product.category}</div>
        <h3 className="font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price?.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="px-3 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50"
            disabled={!product.stock}
          >
            {product.stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
