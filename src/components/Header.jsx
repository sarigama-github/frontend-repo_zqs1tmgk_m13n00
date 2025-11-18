import { ShoppingCart } from "lucide-react";

function Header({ cartCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-xl">AutoParts Shop</span>
        </a>
        <button onClick={onCartClick} className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition">
          <ShoppingCart size={18} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-blue-600 text-white rounded-full w-6 h-6 grid place-items-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;