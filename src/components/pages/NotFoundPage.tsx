import React from 'react';
import { Search, Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

export const NotFoundPage: React.FC = () => {
  const { setCurrentView, setSearchQuery } = useShop();

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
        <span className="font-extrabold text-3xl font-mono text-slate-700">404</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          The page or product category you are looking for has been moved or does not exist on MY SHOP BD.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Catalog</span>
        </button>
      </div>
    </div>
  );
};
