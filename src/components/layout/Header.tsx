import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Layers,
  Sparkles,
  PhoneCall,
  LogOut,
  FolderDown,
  LayoutDashboard,
  Box,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    categories,
    user,
    isAdmin,
    logout,
    language,
    setLanguage,
    setSelectedCategorySlug,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('search');
    }
  };

  const navigateToCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('category');
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* 1. Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="bg-teal-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
              BD Delivery
            </span>
            <span>
              Inside Dhaka Tk 60 • Outside Dhaka Tk 120 • <strong>Free delivery over Tk 3,000!</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-300">
            <div className="flex items-center space-x-1">
              <PhoneCall className="w-3 h-3 text-teal-400" />
              <span>Hotline: +880 1711-000999</span>
            </div>

            <div className="flex items-center space-x-1 border-l border-slate-700 pl-3">
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="hover:text-teal-300 font-semibold transition-colors"
                title="Toggle Language"
              >
                {language === 'en' ? 'Bangla (BN)' : 'English (EN)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="flex items-center space-x-2.5 text-left group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-950 to-teal-900 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform border border-teal-500/30 flex-shrink-0">
            <span>BD</span>
          </div>
          <div className="whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">MY SHOP</span>
              <span className="font-extrabold text-lg sm:text-xl text-teal-600">BD</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium tracking-wide block -mt-1 uppercase">
              Premium Bangladesh Store
            </span>
          </div>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-4 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products, electronics, bioscience guides..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setCurrentView('wishlist')}
            className="relative p-2 text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setCurrentView('cart')}
            className="relative p-2 text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="hidden sm:inline text-xs font-semibold text-slate-800 ml-1">Cart</span>
          </button>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="User Account Menu"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                {user ? user.displayName.charAt(0) : <UserIcon className="w-4 h-4" />}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                {user ? user.displayName.split(' ')[0] : 'Sign In'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setUserDropdownOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Store Admin
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentView('account')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Addresses</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentView('orders')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Box className="w-4 h-4 text-slate-400" />
                      <span>My Orders</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentView('digital-library')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <FolderDown className="w-4 h-4 text-teal-600" />
                      <span className="font-medium text-teal-800">My Digital Library</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setCurrentView('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-xs text-amber-900 hover:bg-amber-50 flex items-center space-x-2 font-semibold border-t border-slate-100"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentView('login')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Customer Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('register')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      Create Account
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setCurrentView('admin-login')}
                        className="w-full text-left px-4 py-2 text-xs text-amber-800 hover:bg-amber-50 font-medium"
                      >
                        Admin Portal
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1 py-1">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-slate-800 hover:text-teal-700 rounded-lg hover:bg-white transition-colors"
              >
                <Layers className="w-4 h-4 text-teal-600" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {categoryDropdownOpen && (
                <div
                  className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in"
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => navigateToCategory(cat.slug)}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold block">{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{cat.nameBn}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                        {cat.productCount}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                currentView === 'home' ? 'text-teal-700 bg-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                currentView === 'shop' ? 'text-teal-700 bg-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shop All
            </button>

            <button
              type="button"
              onClick={() => navigateToCategory('electronics')}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Electronics
            </button>

            <button
              type="button"
              onClick={() => navigateToCategory('science-lab')}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg flex items-center space-x-1"
            >
              <span>Science & Lab</span>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 rounded">Lab</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToCategory('heritage-fashion')}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Heritage Fashion
            </button>

            <button
              type="button"
              onClick={() => navigateToCategory('digital-products')}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
            >
              Digital E-Books
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('digital-library')}
              className="px-3 py-2 text-xs font-bold text-teal-700 hover:text-teal-800 rounded-lg flex items-center space-x-1"
            >
              <FolderDown className="w-3.5 h-3.5 text-teal-600" />
              <span>My Digital Library</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              type="button"
              onClick={() => setCurrentView('about')}
              className="text-slate-500 hover:text-slate-800"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('contact')}
              className="text-slate-500 hover:text-slate-800"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('policy-shipping')}
              className="text-slate-500 hover:text-slate-800"
            >
              Shipping Policy
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-xs font-semibold bg-slate-50 rounded-xl text-slate-800"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('shop');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-xs font-semibold bg-slate-50 rounded-xl text-slate-800"
            >
              Shop All
            </button>
            <button
              type="button"
              onClick={() => navigateToCategory('science-lab')}
              className="p-2.5 text-left text-xs font-semibold bg-sky-50 text-sky-900 rounded-xl"
            >
              Science & Lab Gear
            </button>
            <button
              type="button"
              onClick={() => navigateToCategory('digital-products')}
              className="p-2.5 text-left text-xs font-semibold bg-teal-50 text-teal-900 rounded-xl"
            >
              Digital Library
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Categories
            </span>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => navigateToCategory(c.slug)}
                  className="w-full text-left py-1.5 px-2 text-xs text-slate-700 hover:text-teal-700 flex justify-between"
                >
                  <span>{c.name}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{c.productCount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
