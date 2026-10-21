import React from 'react';
import { Home, ShoppingBag, Heart, User, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    user,
    isAdmin,
    t,
  } = useShop();

  const isHomeActive = currentView === 'home';
  const isShopActive = currentView === 'shop' || currentView === 'category' || currentView === 'search';
  const isWishlistActive = currentView === 'wishlist';
  const isCartActive = currentView === 'cart' || currentView === 'checkout';
  const isAccountActive = currentView === 'account' || currentView === 'orders' || currentView === 'login' || currentView.startsWith('admin');

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isHomeActive
              ? 'text-teal-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5 stroke-[2.2]" />
            {isHomeActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px] text-center">
            {t.home}
          </span>
        </button>

        {/* 2. Shop */}
        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isShopActive
              ? 'text-teal-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
            {isShopActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px] text-center">
            {t.shop}
          </span>
        </button>

        {/* 3. Wishlist */}
        <button
          type="button"
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isWishlistActive
              ? 'text-rose-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 stroke-[2.2] ${isWishlistActive ? 'fill-rose-600' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px] text-center">
            {t.wishlist}
          </span>
        </button>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={() => setCurrentView('cart')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isCartActive
              ? 'text-teal-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-teal-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px] text-center">
            {t.cart}
          </span>
        </button>

        {/* 5. Account / Admin */}
        <button
          type="button"
          onClick={() => {
            if (isAdmin) {
              setCurrentView('admin-dashboard');
            } else if (user) {
              setCurrentView('account');
            } else {
              setCurrentView('login');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isAccountActive
              ? 'text-teal-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="relative">
            <User className="w-5 h-5 stroke-[2.2]" />
            {isAdmin && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" title="Admin" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px] text-center">
            {isAdmin ? 'Admin' : (user ? t.account : 'Sign In')}
          </span>
        </button>
      </div>
    </nav>
  );
};
